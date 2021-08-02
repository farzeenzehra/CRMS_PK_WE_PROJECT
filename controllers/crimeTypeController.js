const con = require('../connection/connection')

function getAddCrimeTypePage(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    let sql = `CALL GetAllLaws()`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.render('addCrimeType', { username: username, firstname: firstname, lastname: lastname, post: post, laws: result[0] });
    });
}
function getUpdateCrimeTypePage(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    let sql = `CALL GetAllLaws()`;
    con.query(sql, function (err, lawRes, fields) {
        if (err)
        {
            res.status(400).send(err.sqlMessage);
            return;
        }
        let sql = `CALL GetAllCrimes()`;
        con.query(sql, function (err, crRes, fields) {
            if (err)
            {
                res.status(400).send(err.sqlMessage);
                return;
            };
            res.render('updateCrimeType', { username: username, firstname: firstname, lastname: lastname, post: post, laws: lawRes[0], crimes:crRes[0] });
        });
    });
}
function getCrimeLaws(req, res)
{
    let crimeId = req.query.crimeID;
    let sql = `CALL GetAssLaws('${crimeId}')`;
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(400).send(err.sqlMessage);
            return;
        };
        res.send(result[0]);
    });
}
function updateCrimeType(req, res) {
    const crimeId = req.body.crimeID;
    const crimeType = req.body.crimeType;
    const associatedLaws = req.body.associatedLaws;
    let sql = `CALL UpdateCrime('${crimeId}','${crimeType}')`;
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(400).send(err.sqlMessage);
            return;
        };
        associatedLaws.forEach(associatedLaw => {
            let sql = `CALL AddCrimeLaw('${crimeId}','${associatedLaw}')`;
            con.query(sql, function (err, innRes, fields) {
                if (err) throw err;
            });
        });
        res.send('Crime Type Updated Successfully');
        logsController.log(req,session.username, "updated a crime type with id: ", crimeId);
    });
}
function addCrimeType(req, res) {
    const crimeType = req.body.crimeType;
    const associatedLaws = req.body.associatedLaws;
    let sql = `CALL AddCrime('${crimeType}')`;
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(400).send(err.sqlMessage);
            return;
        };
        associatedLaws.forEach(associatedLaw => {
            let sql = `CALL AddCrimeLaw('${result[0][0].crimeID}','${associatedLaw}')`;
            con.query(sql, function (err, innRes, fields) {
                if (err) throw err;
            });
        });
        res.send('Crime Type Added Successfully');
        logsController.log(req,session.username, "added a crime type with id: ",result[0][0].crimeID);
    });
}

function viewCrimeType(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    let sql = `CALL GetAllLaws()`;
    con.query(sql, function (err, lawRes, fields) {
        if (err)
        {
            res.status(400).send(err.sqlMessage);
            return;
        }
        let sql = `CALL GetAllCrimes()`;
        con.query(sql, function (err, crRes, fields) {
            if (err)
            {
                res.status(400).send(err.sqlMessage);
                return;
            };
            res.render('viewCrimeType', { username: username, firstname: firstname, lastname: lastname, post: post, laws: lawRes[0], crimes:crRes[0] });
        });
    });
}

module.exports.getAddCrimeTypePage = getAddCrimeTypePage;
module.exports.addCrimeType = addCrimeType;
module.exports.getUpdateCrimeTypePage = getUpdateCrimeTypePage;
module.exports.updateCrimeType = updateCrimeType;
module.exports.getCrimeLaws = getCrimeLaws;
module.exports.viewCrimeType =viewCrimeType;