const express = require('express');
const app = express();
const path = require('path');
const userModel = require("./models/user");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.get('/', function(req,res){
    res.render('index');
})

app.get('/logout', (req,res) => {
    res.cookie('token', "");
    res.redirect('/');
})

app.post('/login',async (req,res) => {
    let user = await userModel.findOne({email: req.body.email})
    if(!user) return res.send("something went wrong");

    bcrypt.compare(req.body.password, user.password, function(err, result){
        if(!result) return res.send("something went wrong");
        else{
            let token = jwt.sign({email: user.email}, 'shhhhhhhhhh');
            res.cookie("token",token);
            res.send('yes you can login');
        }
    });
})

app.get('/login', function(req,res){
    res.render('login');
})

app.post('/create', (req,res) =>{
    let {username, email, password, age} = req.body;

    bcrypt.genSalt(10, (err,salt) => {
        // console.log(salt);
        bcrypt.hash(password, salt, async (err, hash) => {
            // console.log(hash);
            let createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age,
            })

            let token = jwt.sign({email}, 'shhhhhhhhhh');
            res.cookie("token",token);
            res.send(createdUser);
        })
    })   
})

app.listen(3000);