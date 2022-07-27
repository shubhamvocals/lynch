require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const md5 = require("md5");


const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-shubham:test123@cluster0.99q5p.mongodb.net/lynch")

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/signup", function(req, res){
    res.render("signup");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    User.findOne({email: req.body.email}, function(err, foundUser){
        if(foundUser){
            if(foundUser.password === md5(req.body.password)){
                res.sendFile(__dirname + "/index.html");
            }else{
                res.sendFile(__dirname + "/failure.html");
            }
        }
    })
})


app.post("/status", function(req, res){
    User.findOne({email: req.body.email}, function(err, foundUser){
        if(!err){
            if(!foundUser){
                const user = new User ({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: md5(req.body.password)
                });
                user.save().then(res.sendFile(__dirname + "/success.html"));
            }else{
                res.sendFile(__dirname + "/already-registered.html");
            }
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
    });
    
});

app.post("/failure", function(req, res){
    res.redirect("/signup");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port");
});