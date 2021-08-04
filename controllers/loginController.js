const con = require('../connection/connection')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config.json')

function getLoginPage(req, res) {
    if (!req.session.loggedin) {
        res.setHeader('Cache-Control', 'no-store');
        res.render('index');
    }
    else {
        res.redirect('/dashboard')
        // next();
    }
}

function authenticateLogin(req, res) {
    // console.log("hello");
    const username = req.body.username
    let sql = `CALL AuthenticateUser(?)`;
    con.query(sql, username, function (err, result, fields) {
        if (err) throw err;
        try {
            var hash = crypto.createHash('sha1').update(`${req.body.password}${result[0][0].salt}`).digest('hex');
        }
        catch (err) {
            req.flash('error', 'Please enter correct Username and Password!')
            res.redirect('/');
            return;
        }
        if (hash == result[0][0].password) {
            req.session.loggedin = true;
            req.session.username = username;
            req.session.firstname = result[0][0].firstname;
            req.session.lastname = result[0][0].lastname;
            req.session.post = result[0][0].post;

            res.cookie('IsLoggedIn', 'true');

            //jwt genration
            var token = jwt.sign({ "username": username ,"post":result[0][0].post}, config.secret, {
                expiresIn: "24h" // expires in 24 hours
            });
            res.cookie('Token', token, {
                maxAge: 1000 * 60 * 60 * 24,
                // secure : true,
                // signed:true
            });
            // console.log("hello");
            // res.redirect('/dashboard')
            // next();
            let sql = "CALL GetRecentLogs()";
            con.query(sql, function (err, resultLogs) {
                if (err) throw err;
                res.setHeader('Cache-Control', 'no-store');
                res.render('dashboard', { username: username, firstname: result[0][0].firstname, lastname: result[0][0].lastname, post: result[0][0].post, logs: resultLogs[0] });
            })
        }
        else {
            req.flash('error', 'Please enter correct username and Password!')
            res.redirect('/');
        }
    });

}

function logout(req, res) {
    req.session.loggedin = false;
    req.session.destroy((err) => {
        if (err) throw err;
        res.clearCookie('user_Id');
        res.clearCookie('Token');
        res.cookie('IsLoggedIn', 'false', {
            maxAge: 1000 * 60 * 60 * 24,
            // secure : true,
            // signed:true
        });
        // con.end();
        // res.setHeader('Clear-Site-Data', '"cache", "cookies"');
        res.redirect('/');
    });

}

function forgotPassword(req, res, next) {
    let sql = `CALL GetOTP('${req.body.username}')`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result[0][0].OTP == "User Not Found") {
            res.send([result[0][0].OTP]);
        }
        else {
            res.locals.fullname = result[0][0].FullName;
            res.locals.OTP = result[0][0].OTP;
            res.locals.email = result[0][0].Email;
            next();
        }
    });
}

function changePassword(req, res) {
    let username = req.body.username;
    let newPass = req.body.newPass;
    let CnewPass = req.body.CnewPass;
    let code = req.body.code;
    if (newPass == CnewPass && /^((?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{5,})$/.test(newPass) && /^([0-9]{6,6})$/.test(code)) {

        let sql = `CALL AuthenticateUser(?)`;
        con.query(sql, username, function (err, result) {
            if (err) throw err;
            var hash_pass = crypto.createHash('sha1').update(`${newPass}${result[0][0].salt}`).digest('hex');
            let sql = `CALL ChangePassword('${username}','${code}','${hash_pass}')`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.send([result[0][0].passChanged]);
            });
        });
    }
    else {
        res.send(["Couldn't Change Password!"]);
    }
}
module.exports.getLoginPage = getLoginPage;
module.exports.authenticateLogin = authenticateLogin;
module.exports.logout = logout;
module.exports.forgotPassword = forgotPassword;
module.exports.changePassword = changePassword;