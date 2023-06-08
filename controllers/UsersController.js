const CryptoJS = require("crypto-js");
const key = "sahinotes";
var User = require('../models/users');
var Session = require('../models/session');

module.exports.signinFunction = function(req, res) {
    return res.render('signin');
}

module.exports.signupFunction = function signup(req, res) {
    return res.render('signup');
}

module.exports.createUser = async (req, res) => {
    console.log(req);
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    console.log(name, email, password);
    var confirm_password = req.body.confirm_password;
    if (password!=confirm_password) {
        console.log("Passwords don't match");
        return res.status(400).send({"success": false, "message": "The passwords don't match!"});
    } else {
        try {
            var user = await User.findOne({email: email});
            if (user==undefined) {
                const encryptedPassword = await CryptoJS.AES.encrypt(password, key);
                var user = await User.create({
                    name: name,
                    email: email,
                    password: encryptedPassword
                });
                return res.redirect('/users/auth/signin');
            } else {
                console.log("This email already exists");
                return res.status(409).send({"success": false, "message": "This email already exists! Please signin!"});
            }
        } catch(err) {
            console.log("Error in the create user controller: ", err);
            return;
        }
    }
}

module.exports.createSession = async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    const encryptedPassword = await CryptoJS.AES.encrypt(password, key);
    var user = await User.findOne({email: email});
    if (user==undefined) {
        console.log('Email does not exist');
        return res.status(400).send({"success": false, "message": "Please signup first!"})
    } else {
        if (user.password!=encryptedPassword) {
            console.log('Password does not match');
            return res.status(401).send({"success": false, "message": "Please enter the correct password!"});
        } else {
            console.log('Signin successful');
            var session = await Session.findOne({email: email});
            var currentDate = new Date();
            var expiryDate = currentDate.setHours(currentDate.getHours()+24);
            if (session==undefined) {
                var session = await Session.create({
                    email: email,
                    expiryDate: expiryDate
                });
                return res.redirect('/users/profile', {
                    user_id: user.id
                });
            } else {
                session.expireDate = expiryDate;
                return res.redirect('/users/profile', {
                    user_id: user.id
                });
            }
        }
    }
}

module.exports.logout = async function(req, res) {
    var user_id = req.params.user_id;
    var user = await User.findById(user_id);
    if (user==undefined) {
        console.log('Error while logging out');
        return res.status(500).send({"success": false, "message": "Internal server error"});
    } else {
        var email = user.email;
        var session = await Session.findOneAndDelete({email: email});
        res.status(201).send({"success": true, "message": "Logout successful"});
        return redirect('/users/auth/signin');
    }
}