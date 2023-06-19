const bcrypt = require('bcryptjs');
const key = "sahinotes";
var User = require('../models/users');
var Session = require('../models/session');
const smsApiKey = "bh45nmQSfGAWiX8Nv6ZJHRkpFD0tE37qTPsVCzMlgY2BIdyex9mSQfCvGbs6U9pEXKiY4Rq0BjzWd2oZ";
var unirest = require("unirest");

module.exports.signinFunction = function(req, res) {
    return res.render('signin');
}

module.exports.signupFunction = function signup(req, res) {
    return res.render('signup');
}

module.exports.profile = function profile(req, res) {
    var user_id = req.params.user_id;
    console.log(user_id);
    return res.render('profile', {
        user_id: user_id
    });
}

module.exports.mobileVerify = (req, res) => {
    return res.render('mobile_verify');
}

module.exports.createUser = async (req, res) => {
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
                // const encryptedPassword = await CryptoJS.AES.encrypt(key, password).toString();
                const salt = await bcrypt.genSalt(10);
                const encryptedPassword = await bcrypt.hash(password, salt);
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
    // const encryptedPassword = await CryptoJS.AES.encrypt(key, password).toString();
    var user = await User.findOne({email: email});
    if (user==undefined) {
        console.log('Email does not exist');
        return res.status(400).send({"success": false, "message": "Please signup first!"})
    } else {
        const compare = await bcrypt.compare(password, user.password);
        console.log(compare);
        if (compare==false) {
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
                    expireDate: expiryDate
                });
                return res.redirect(`/users/profile/${user.id}`, 201, {
                    user_id: user.id
                });
            } else {
                session.expireDate = expiryDate;
                return res.redirect('/users/profile/'+user.id, 201, {
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

module.exports.sendOtp = (req, res) => {
    var otp = Math.floor(1000 + Math.random() * 9000);
    console.log(req.body);
    var mobileNumber = req.body.mobileNumber;
    console.log(mobileNumber, otp);
    var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
    req.query({
    "authorization": smsApiKey,
    "variables_values": otp,
    "route": "otp",
    "numbers": mobileNumber
    });
    req.headers({
        "cache-control": "no-cache"
    });
    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        console.log(res.body);
    });
}