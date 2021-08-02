const crypto = require('crypto');
const con = require('../connection/connection')
const formidable = require('formidable')
const emailController = require('./emailController')
const fs = require('fs');
const logsController = require('./logsController')

function addUser(req, res) {

    const username = req.session.username;
    const recievedForm = new formidable.IncomingForm();
    recievedForm.parse(req, function (err, fields, files) {

        const accUsername = fields.Username;
        for (const key in files) {
            if (files[key].size != 0) {
                let blobname = `${accUsername}.jpg`;
                var rawData = fs.readFileSync(files[key].path)
                fs.writeFile("./public/images/" + blobname, rawData, err => {
                    if (err) {
                        res.status(400).send("An error occurred!")
                        return;
                    };
                });
            }
        };
        const cnic = fields.CNIC;
        const firstname = fields.FirstName;
        const lastname = fields.LastName;
        const fullname = firstname+" "+lastname;
        const fcnic = fields.FatherCNIC;
        const mcnic = fields.MotherCNIC;
        const dob = fields.DOB;
        const address = fields.Address;
        const mob = fields.MobileNum;
        const email = fields.Email;
        const post = fields.Post;

        const idForKey = crypto.randomBytes(24).toString("hex");
        const apiKey = Buffer.from(accUsername + idForKey).toString('base64');

        const verificN = crypto.randomInt(10000000000000,99999999999999);
        const verificCode = Buffer.from(accUsername +'@_'+ verificN).toString('base64');

        const salt = crypto.randomInt(100000,999999);
        const password = crypto.randomBytes(9).toString("base64");
        const hashedPass = crypto.createHash('sha1').update(`${password}${salt}`).digest('hex');


        let sql = `CALL AddUser('${accUsername}','${hashedPass}','${salt}','${firstname}','${lastname}','${cnic}','${address}','${mob}','${email}','${fcnic}','${mcnic}','${dob}','${post}','${verificN}','${apiKey}')`;
        con.query(sql, function (err) {
            if (err) {
                res.status(400).send(err.sqlMessage);
                return;
            }
            res.status(200).send({"usern":accUsername,"pass":password});
            emailController.sendVerificationEmail(accUsername,password,verificCode,fullname,email);
            logsController.log(username, "added a user account with username: ", accUsername);
        });

    });
    // username = 'admin';
    // const id = crypto.randomBytes(12).toString("hex");
    // const key = Buffer.from(username + id).toString('base64');
    // const decodedKey = Buffer.from(key, 'base64').toString('ascii');

    // const vN = crypto.randomInt(99999999999999);
    // const vCode = Buffer.from(username + vN).toString('base64');
    // const dvCode = Buffer.from(vCode, 'base64').toString('ascii');
    // console.log(key);
    // console.log(decodedKey);
    // console.log(vCode);
    // console.log(dvCode);
}

function getCreateAccPage(req, res)
{
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    res.render('createAccount', { username: username, firstname: firstname, lastname: lastname, post: post});
}

function getUsername(req, res)
{
    const fN = req.query.firstname;
    let sql = `CALL GetUsername('${fN}')`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(result[0][0]);
    });
}

function verifyAccount(req, res)
{
    const vCode = req.query.vCode;
    const dvCode = Buffer.from(vCode, 'base64').toString('ascii');
    const username = dvCode.split('@_')[0];
    const vN = dvCode.split('@_')[1];
    let sql = `CALL VerifyUser('${username}','${vN}')`;
    con.query(sql, function (err, result, fields) {
        if (err)
        {
            req.flash('error', 'An Error Occurred!')
            res.redirect('/');
            return;
        };
        if(result[0][0].status == 'Not Verified')
        {
            req.flash('error', 'An Error Occurred!')
            res.redirect('/');
            return;
        }
        req.flash('success', 'Account Verified!')
        res.redirect('/');
        return;
    });

}
module.exports.verifyAccount = verifyAccount;
module.exports.getCreateAccPage = getCreateAccPage;
module.exports.addUser = addUser;
module.exports.getUsername = getUsername;