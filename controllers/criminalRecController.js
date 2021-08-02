const con = require('../connection/connection')
const formidable = require('formidable');
const fs = require('fs');
const logsController = require('./logsController')

function viewAllCriminalRec(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    let sql = `CALL GetAllCriminalRec(${null})`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render('view_all_criminal_rec', { username: username, firstname: firstname, lastname: lastname, post: post, results: result[0] });
    })
}

function getMoreCriminalRec(req, res) {
    const last_id = req.query.last_id;
    let sql = `CALL GetAllCriminalRec(${last_id})`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(result[0]);
    });
}

function searchCriminalRec(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    res.render('searchCriminalRec', { username: username, firstname: firstname, lastname: lastname, post: post });
}
function searchCriminalRecResults(req, res) {
    const sG = req.query.selectedGrp;
    const sQ = req.query.searchQuery;
    let sql = `CALL SearchCriminalRec('${sG}','${sQ}')`;

    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(result[0]);
    });

}

function addCriminalRecordPage(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    res.render('addCriminalRecord', { username: username, firstname: firstname, lastname: lastname, post: post });
}
function processAddCriminalRec(req, res) {
    const username = req.session.username;
    const recievedForm = new formidable.IncomingForm();
    recievedForm.parse(req, function (err, fields, files) {
        // console.log(fields.CNIC);
        // console.log(files);
        for (const key in files) {
            let blobname = `${fields.CNIC}-${key}.jpg`;
            var rawData = fs.readFileSync(files[key].path)
            fs.writeFile("./public/images/" + blobname, rawData, err => {
                if (err) {
                    res.status(400).send("An error occurred!")
                    return;
                };
            });
        };
        const cnic = fields.CNIC;
        const height = fields.Height;
        const weight = fields.Weight;
        const complexion = fields.Complexion;
        const hColor = fields.HairColor;
        const eColor = fields.EyeColor;
        const lang = fields.Lang;
        const moi = fields.MOI;
        let sql = `CALL AddCriminalRec('${cnic}','${lang}','${height}','${weight}','${complexion}','${eColor}','${hColor}','${moi}')`;
        con.query(sql, function (err, result) {
            if (err) {
                res.status(400).send(err.sqlMessage);
                return;
            }
            res.status(200).send('Added Criminal Successfully!');
            const id = result[0][0].id;
            logsController.log(username, "added to a criminal with id: ", id);
        });

    });
}

function updCriminalRecordPage(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    res.render('updateCriminalRecord', { username: username, firstname: firstname, lastname: lastname, post: post });
}

function getCriminalInfo(req, res) {
    const query = req.query.query;
    const searchBy = req.query.searchBy;
    let sql = `CALL GetCriminalInfo('${query}','${searchBy}')`;

    con.query(sql, function (err, result, fields) {
        if (err) {
            // throw err;
            res.status(400).send("An error occurred!")
            return;
        };
        if (result[0][0] == null) {
            res.status(400).send("Record Not Found!")
            return;
        }
        result[0][0].frontProfile = `images/${result[0][0].CNIC}-frontProfileImage.jpg`;
        result[0][0].leftProfile = `images/${result[0][0].CNIC}-leftProfileImage.jpg`;
        result[0][0].rightProfile = `images/${result[0][0].CNIC}-rightProfileImage.jpg`;
        res.send(result[0][0]);
    });
}

function processUpdateCriminalRec(req, res) {
    const username = req.session.username;
    const recievedForm = new formidable.IncomingForm();
    recievedForm.parse(req, function (err, fields, files) {

        for (const key in files) {
            if (files[key].size != 0) {
                let blobname = `${fields.CNIC}-${key}.jpg`;
                var rawData = fs.readFileSync(files[key].path)
                fs.writeFile("./public/images/" + blobname, rawData, err => {
                    if (err) {
                        res.status(400).send("An error occurred!")
                        return;
                    };
                });
            }

        };
        const crId = fields.CriminalID;
        const height = fields.Height;
        const weight = fields.Weight;
        const complexion = fields.Complexion;
        const hColor = fields.HairColor;
        const eColor = fields.EyeColor;
        const lang = fields.Lang;
        const moi = fields.MOI;
        let sql = `CALL UpdateCriminalRec('${crId}','${lang}','${height}','${weight}','${complexion}','${eColor}','${hColor}','${moi}')`;
        con.query(sql, function (err, result) {
            if (err) {
                res.status(400).send(err.sqlMessage);
                return;
            }
            res.status(200).send('Updated Criminal Record Successfully!');
            logsController.log(username, "updated a criminal record with id: ", crId);
        });

    });
}
function getFullCriminalRecord(req, res) {
    const id = req.query.id;
    let sql = `CALL GetCriminalInfo(${id},'crID')`;
    con.query(sql, function (err, criminalInfo) {
        if (err)
        {
            res.status(400);
            return;
        };
        criminalInfo[0][0].frontProfile = `images/${criminalInfo[0][0].CNIC}-frontProfileImage.jpg`;
        criminalInfo[0][0].leftProfile = `images/${criminalInfo[0][0].CNIC}-leftProfileImage.jpg`;
        criminalInfo[0][0].rightProfile = `images/${criminalInfo[0][0].CNIC}-rightProfileImage.jpg`;
        let sql = `CALL GetAllCrimeRecsOfCriminal(${id})`;
        con.query(sql, function (err, crimesInfo) {
            if (err) throw err;
            res.send({"criminal":criminalInfo[0][0], "crimes":crimesInfo[0] });
        })
    });
}
module.exports.getFullCriminalRecord = getFullCriminalRecord;
module.exports.processUpdateCriminalRec = processUpdateCriminalRec;
module.exports.getCriminalInfo = getCriminalInfo;
module.exports.searchCriminalRec = searchCriminalRec;
module.exports.getMoreCriminalRec = getMoreCriminalRec;
module.exports.viewAllCriminalRec = viewAllCriminalRec;
module.exports.searchCriminalRecResults = searchCriminalRecResults;
module.exports.addCriminalRecordPage = addCriminalRecordPage;
module.exports.processAddCriminalRec = processAddCriminalRec;
module.exports.updCriminalRecordPage = updCriminalRecordPage;