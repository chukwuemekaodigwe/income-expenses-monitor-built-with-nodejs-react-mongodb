const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const dbConnect = require('./db/dbConnect')
const User = require('./db/UserModel')

const auth = require("./middleware/auth");

// execute the database connenction
dbConnect();

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
    response.json({ message: "Hey! This is your server response!" });
    next();
});

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then((hashed_password) => {
            const user = new User({
                email: req.body.email,
                password: hashed_password
            })

            user.save().then((success) => {
                res.status(201).send({
                    message: 'User created successfully',
                    success
                })
            })
                .catch((err) => {
                    res.status(500).send({
                        message: 'Error creating user',
                        err
                    })
                })
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Password was not hashed successfully',
                err
            })
        })
})

app.post('/login', (req, res) => {

    User.findOne({ email: req.body.email }).then((result) => {
        bcrypt.compare(req.body.password, result.password)
            .then((succ) => {
                if (!succ) {
                    return this.response.status(400).send({
                        message: 'Password doesnot match'
                    })
                }

                const token = jwt.sign({
                    userId: succ._id,
                    userEmail: succ.email
                },
                    'random_key',
                    { expiresIn: '24h' }
                );

                res.status(200).send({ message: 'login Successful', email: succ.email, token })
            })
            .catch((err) => {
                res.status(400).send({
                    message: 'Password does not match',
                    err
                })
            })
    })
        .catch((err) => {
            res.status(404).send({
                message: 'Email not found',
                err
            })
        })
})

// to be retieved after a successful login

app.get('/user', auth, (req, res)=>{
    return res.status(200).send({
        user: req.user,
        message: 'successsfully accessed'
    })
})


// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

  
module.exports = app