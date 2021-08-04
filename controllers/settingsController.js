const con = require('../connection/connection')
const crypto = require('crypto')
const logsController = require('./logsController')

function viewProfile(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    let sql = `CALL GetUserInfo('${username}')`;
    con.query(sql, function (err, result, fields) {
        if (err) {
            req.flash('error', "An error occurred!")
            return;
        };
        if (result[0][0] == null) {
            req.flash('error', "An error occurred!")
            return;
        }
        res.render('viewProfile', { username: username, firstname: firstname, lastname: lastname, post: post, user: result[0][0] });
    });
}
function viewSettings(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    let sql = `CALL GetUserInfo('${username}')`;
    con.query(sql, function (err, result, fields) {
        if (err) {
            req.flash('error', "An error occurred!")
            return;
        };
        if (result[0][0] == null) {
            req.flash('error', "An error occurred!")
            return;
        }
        res.render('settings', { username: username, firstname: firstname, lastname: lastname, post: post, user: result[0][0] });
    });
}
function changePasswordWold(req, res) {
    let username = req.session.username;
    let newPass = req.body.newPass;
    let CnewPass = req.body.CnewPass;
    let oldPass = req.body.oldPass;
    if (newPass == CnewPass && /^((?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{5,})$/.test(newPass)) {
        let sql = `CALL AuthenticateUser(?)`;
        con.query(sql, username, function (err, result, fields) {
            if (err) {
                res.status(400).send("Oops! Could not change password.");
                return;
            };
            var oldPass_hash = crypto.createHash('sha1').update(`${oldPass}${result[0][0].salt}`).digest('hex');
            var hash_pass = crypto.createHash('sha1').update(`${newPass}${result[0][0].salt}`).digest('hex');
            let sql = `CALL ChangePasswordWold('${username}','${oldPass_hash}','${hash_pass}')`;
            con.query(sql, function (err, result) {
                if (err) {
                    res.status(400).send("Oops! Could not change password.");
                    return;
                };
                let rslt = result[0][0].rslt;
                console.log(rslt);
                if (rslt == "Oops! Wrong Password") {
                    res.status(400).send(rslt);
                    return;
                }
                res.send(rslt);
                logsController.log(req.session.username, "changed password", '');
                return;
            });
        });
    }
    else {
        res.status(400).send("Oops! Could not change password.")
        return;
    }
}

function getMyLogs(req, res) {
    const username = req.session.username;
    const last_id = (req.query.last_id == "null") ? null : `${req.query.last_id}`;
    let sql = `CALL GetMyLogs('${username}',${last_id})`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(400).send("Oops! Some error occurred")
            return;
        };
        res.send(result[0]);
    });
}
module.exports.getMyLogs = getMyLogs;
module.exports.changePasswordWold = changePasswordWold;
module.exports.viewSettings = viewSettings;
module.exports.viewProfile = viewProfile;