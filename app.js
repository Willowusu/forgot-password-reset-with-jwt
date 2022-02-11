const express = require('express');
const jwt = require('jsonwebtoken')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

let user = {
    id: "loremipsumdolor",
    email: "johndoe@gmail.com",
    password: "ljbzdhg867t238u08njn@o8y7dvb"
};

const JWT_SECRET = "some super secret..."

app.get('/', (req, res) => {
    res.send("Hello world")
})

app.get("/forgot-password", (req, res, next) => {
    res.render("forgot-password")
})


app.post("/forgot-password", (req, res, next) => {
    const { email } = req.body;
    //make sure user exists in database
    if (email !== user.email) {
        res.send("user not registered");
        return;
    }

    //user exists and now create one time password link valid for 15 minutes
    const secret = JWT_SECRET + user.password;
    const payload = {
        email: user.email,
        id: user.id
    }

    const token = jwt.sign(payload, secret, { expiresIn: '5h' })
        //generate link from token
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`
    console.log(link)
        //send email here
    res.send("Password rest link has been sent to user")



})

app.get("/reset-password/:id/:token", (req, res, next) => {
    const { id, token } = req.params;
    //verify token
    //chek if this id exists in the database
    if (id !== user.id) {
        res.send("invalid id")
        return;
    }
    //we have a calid id and a valid user with this id
    const secret = JWT_SECRET + user.password
        //validate jwt token
    try {
        const payload = jwt.verify(token, secret)
        res.render("reset-password", { email: user.email })
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
})

app.post("/reset-password/:id/:token", (req, res, next) => {
    const { id, token } = req.params;
    const { password, password2 } = req.body
        //check if token is valid and id exists
    if (id !== user.id) {
        res.send("Invalid id...");
        return;
    }
    //validate token 
    const secret = JWT_SECRET + user.password
    try {
        const payload = jwt.verify(token, secret)
            //validate: password and password2 should match
            //assuming password match

        //we can simply find the user with the payload email and id and finally update with new password
        //always hash the password befor saving

        user.password = password;
        res.send(user)


    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
    //res.send(user);
})


app.listen(3000, () => console.log("Running port 3000"));