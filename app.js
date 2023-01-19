require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// app.set('trust proxy', 1);
app.use(session({
  secret: 'My Secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(process.env.MONGO_ID);
// mongoose.connect("mongodb://localhost:27017/lynch");


const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    googleId: String,
    highscore: String
});


userSchema.plugin(passportLocalMongoose, {usernameField: "email"});
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());                    // Our own made strategy
                    
passport.serializeUser(function(user, done) {
    done(null, user);
  });
   
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

passport.use(new GoogleStrategy({                       // Google Strategy
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    // callbackURL: "http://localhost:3000/auth/google/secrets"
    callbackURL: "https://lynch.onrender.com/auth/google/secrets"
    // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id, firstName: profile.name.givenName, lastName: profile.name.familyName}, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res){
    res.render("index", {fontAwesomeID: process.env.FONTAWESOME_ID});
});

app.get("/signup", function(req, res){
    res.render("signup", {fontAwesomeID: process.env.FONTAWESOME_ID});
});

app.get("/login", function(req, res){
    res.render("login", {fontAwesomeID: process.env.FONTAWESOME_ID});
});

app.get("/auth/google", passport.authenticate('google', { scope: ["profile"] } ));

app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/secrets');
});

app.post("/status", function(req, res){
    // User.findOne({email: req.body.email}, function(err, foundUser){
    //     if(!err){
    //         if(!foundUser){
    //             bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    //                 const user = new User ({
    //                     firstName: req.body.firstName,
    //                     lastName: req.body.lastName,
    //                     email: req.body.email,
    //                     password: hash
    //                 });
    //                 user.save().then(res.sendFile(__dirname + "/success.html"));
    //             });
    //         }else{
    //             res.sendFile(__dirname + "/already-registered.html");
    //         }
    //     }else{
    //         res.sendFile(__dirname + "/failure.html");
    //     }
    // });
    const user = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        highscore: "0"
    });
    User.register(user, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/signup");
        }else{
            passport.authenticate('local')(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });
    
});

app.get("/secrets", function(req, res){
    if(req.isAuthenticated()){
        if(req.user.email){
            if(req.user.lastName)
                res.render("startpage", {userFullName: (req.user.firstName + " " + req.user.lastName), userFirstName: req.user.firstName, userLastName: req.user.lastName, userEmail: req.user.email, highscore: req.user.highscore, fontAwesomeID: process.env.FONTAWESOME_ID});
            else
                res.render("startpage", {userFullName: req.user.firstName, userFirstName: req.user.firstName, userLastName: "", userEmail: req.user.email, highscore: req.user.highscore, fontAwesomeID: process.env.FONTAWESOME_ID});
        }
        else{
            if(req.user.lastName)
                res.render("startpage", {userFullName: (req.user.firstName + " " + req.user.lastName), userFirstName: req.user.firstName, userLastName: req.user.lastName, userEmail: "", userGoogleId: req.user.googleId, highscore: req.user.highscore, fontAwesomeID: process.env.FONTAWESOME_ID});
            else
                res.render("startpage", {userFullName: req.user.firstName, userFirstName: req.user.firstName, userLastName: "", userEmail: "", userGoogleId: req.user.googleId, highscore: req.user.highscore, fontAwesomeID: process.env.FONTAWESOME_ID});
        }
    }else{
        res.redirect("/login");
    }
});

app.post("/update", function(req, res){
    User.findOneAndUpdate({$or:[{googleId: req.body.googleId}, {email: req.body.email}]}, {highscore: req.body.hiddenHighscore}, function(err){
        if(err){
            console.log(err);
        }
    });
});


app.post("/login", function(req, res){
    // User.findOne({email: req.body.email}, function(err, foundUser){
    //     if(foundUser){
    //         bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
    //             if(result === true){
    //                 res.sendFile(__dirname + "/index.html");
    //             }
    //             else{
    //                 res.sendFile(__dirname + "/failure.html");
    //             }
    //         });
    //     }else{
    //         res.sendFile(__dirname + "/failure.html");
    //     }
    // });
    const user = new User ({
        email: req.body.email,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    })
});

app.post("/logout", function(req, res){
    req.logout(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    });
});

app.post("/failure", function(req, res){
    res.redirect("/signup");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port");
});
