const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-shubham:test123@cluster0.99q5p.mongodb.net/lynch")

const userSchema = {
    firstName: String,
    lastName: String,
    email: String,
    password: String
}

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/signup", function(req, res){
    res.render("signup");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/status", function(req, res){
    
    User.findOne({email: req.body.email}, function(err, foundUser){
        if(!err){
            if(foundUser === null){
                const user = new User ({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
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