const con = require('../connection/connection')
const fs = require('fs')

function log(username,description, logged_id)
{
    let sql = `CALL Log('${username}','${description}','${logged_id}')`;
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
        });
}

function logFaceDetection(imagePath, username,description, logged_id)
{
    let sql = `CALL LogFaceDetection('${username}','${description}',${logged_id})`;
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            // console.log(result[0][0].updatedLoggedID);
            updatedLoggedID=result[0][0].updatedLoggedID;
            let blobname = `${updatedLoggedID}.jpeg`;
            var rawData = fs.readFileSync(imagePath)
            fs.writeFile( "./public/images/"+blobname,rawData, err => {
                if (err) throw err;
                // console.log("The file was saved!");
            }); 
        });
}
function getAllLogs(req,res)
{
    let sql = `CALL GetAllLogs()`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        // console.log(result[0]);
        res.send(result[0]);
    });
    
}
function viewAllLogs(req,res)
{
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    
    let sql = `CALL ViewAllLogs(${null})`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.render('view_all_logs', { username: username, firstname: firstname, lastname: lastname, post: post, logs:result[0]});
    });
}

function getMoreLogs(req, res)
{
    const last_id = req.query.last_id;
    let sql = `CALL ViewAllLogs(${last_id})`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(result[0]);
    });
}
function getCrimeLogs(req, res)
{
    let sql = `CALL GetMonthlyCrimeLogs()`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        // console.log(result[0]);
        res.send(result[0]);
    });
}
function getChangesinRecordLogs(req, res)
{
    let sql = `CALL GetChangesinRecordLogs()`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        // console.log(result[0]);
        res.send(result[0]);
    });
}
module.exports.logFaceDetection = logFaceDetection;
module.exports.log = log;
module.exports.getAllLogs = getAllLogs;
module.exports.getCrimeLogs = getCrimeLogs;
module.exports.getChangesinRecordLogs = getChangesinRecordLogs;
module.exports.viewAllLogs =  viewAllLogs;
module.exports.getMoreLogs = getMoreLogs;