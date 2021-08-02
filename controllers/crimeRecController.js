const con = require('../connection/connection')
const logsController = require('./logsController')

function viewAllCrimeRec(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    let sql = `CALL GetAllCrimeRec(${null})`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render('viewAllCrimeRecs', { username: username, firstname: firstname, lastname: lastname, post: post, results: result[0] });
    })
}

function getMoreCrimeRec(req, res) {
    const last_id = req.query.last_id;
    let sql = `CALL GetAllCrimeRec(${last_id})`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(result[0]);
    });
}
function searchCrimeRec(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    res.render('searchCrimeRec', { username: username, firstname: firstname, lastname: lastname, post: post });
}
function searchCrimeRecResults(req, res) {
    const sG = req.query.selectedGrp;
    const sQ = req.query.searchQuery;
    let sql = `CALL SearchCrimeRec('${sG}','${sQ}')`;

    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(result[0]);
    });

}

function getAddCrimeRecordPage(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    let sql = `CALL GetAllCrimes()`;
    con.query(sql, function (err, crRes, fields) {
        if (err) {
            res.status(400).send(err.sqlMessage);
            return;
        };
        let sql = `CALL GetAllJails()`;
        con.query(sql, function (err, jailRes, fields) {
            if (err) {
                res.status(400).send(err.sqlMessage);
                return;
            };
            res.render('AddCrimeRec', { username: username, firstname: firstname, lastname: lastname, post: post, jails: jailRes[0], crimes: crRes[0] });
        });
    });
}

function processAddCrimeRec(req, res) {
    const username = req.session.username;
    const CrId = req.body.CrId;
    const crimeId = req.body.crimeId;
    const Status = req.body.Status;
    const AD = req.body.AD;
    const RD = (req.body.RD == '') ? null : `'${req.body.RD}'`;
    const JailNo = (req.body.JailNo == '') ? null : `'${req.body.JailNo}'`;
    const CaseNo = (req.body.CaseNo == '') ? null : `'${req.body.CaseNo}'`;
    const FIRNo = req.body.FIRNo;
    const Description = req.body.Description;
    const Punishment = req.body.Punishment;
    let sql = `CALL AddCrimeRec('${CrId}','${crimeId}','${Status}','${AD}',${RD},${JailNo},'${FIRNo}',${CaseNo},'${Description}','${Punishment}')`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(400).send(err.sqlMessage);
            return;
        }
        res.status(200).send('Added Crime Record Successfully!');
        const id = result[0][0].id;
        logsController.log(username, "added a crime record with id: ", id);
    });
}

function getUpdateCrimeRecPage(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    let sql = `CALL GetAllCrimes()`;
    con.query(sql, function (err, crRes, fields) {
        if (err) {
            res.status(400).send(err.sqlMessage);
            return;
        };
        let sql = `CALL GetAllJails()`;
        con.query(sql, function (err, jailRes, fields) {
            if (err) {
                res.status(400).send(err.sqlMessage);
                return;
            };
            res.render('UpdateCrimeRecord', { username: username, firstname: firstname, lastname: lastname, post: post, jails: jailRes[0], crimes: crRes[0] });
        });
    });
}
function getCrimesOfCriminal(req, res) {
    const crId = req.query.criminalID;
    let sql = `CALL GetCrimesOfCriminal(${crId})`;
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(400).send(err.sqlMessage);
            return;
        };
        res.send(result[0])
    });
}

function getCrimeRecInfo(req, res) {
    const recId = req.query.recID;
    let sql = `CALL GetCrimeRecInfo(${recId})`;
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(400).send(err.sqlMessage);
            return;
        };
        res.send(result[0][0])
    });
}

function processUpdateCrimeRec(req,res)
{
    const username = req.session.username;
    const RecId = req.body.RecordID;
    const crimeId = req.body.crimeId;
    const Status = req.body.Status;
    const AD = req.body.AD;
    const RD = (req.body.RD == '') ? null : `'${req.body.RD}'`;
    const JailNo = (req.body.JailNo == '') ? null : `'${req.body.JailNo}'`;
    const CaseNo = (req.body.CaseNo == '') ? null : `'${req.body.CaseNo}'`;
    const FIRNo = req.body.FIRNo;
    const Description = req.body.Description;
    const Punishment = req.body.Punishment;
    let sql = `CALL UpdateCrimeRec('${RecId}','${crimeId}','${Status}','${AD}',${RD},${JailNo},'${FIRNo}',${CaseNo},'${Description}','${Punishment}')`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(400).send(err.sqlMessage);
            return;
        }
        res.status(200).send('Updated Crime Record Successfully!');
        logsController.log(username, "updated a crime record with id: ", RecId);
    });
}
module.exports.processUpdateCrimeRec = processUpdateCrimeRec;
module.exports.getCrimeRecInfo = getCrimeRecInfo;
module.exports.getCrimesOfCriminal = getCrimesOfCriminal;
module.exports.getUpdateCrimeRecPage = getUpdateCrimeRecPage;
module.exports.processAddCrimeRec = processAddCrimeRec;
module.exports.getAddCrimeRecordPage = getAddCrimeRecordPage;
module.exports.searchCrimeRec = searchCrimeRec;
module.exports.searchCrimeRecResults = searchCrimeRecResults;
module.exports.getMoreCrimeRec = getMoreCrimeRec;
module.exports.viewAllCrimeRec = viewAllCrimeRec;