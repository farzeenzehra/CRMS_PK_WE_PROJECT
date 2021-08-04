const con = require('../connection/connection')
const logsController = require('./logsController')

function getCrimeReport(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    res.render('crimeReport', { username: username, firstname: firstname, lastname: lastname, post: post });
}
function genCrimeReport(req, res) {
    const id = req.query.id;
    let sql = `CALL GetCriminalRecDetails(${id})`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        let crimeInfo = {};
        let firInfo = {};
        let psInfo ={};
        let caseInfo = {};
        let courtInfo = {};
        let jailInfo = {};
        let policeInfo = {};
        let n=1;
        for(const key in result[0][0])
        {
            if(n<=9) crimeInfo[key] = result[0][0][key]
            else if(n>9 && n<=15) firInfo[key] = result[0][0][key]
            else if(n>15 && n<=18) psInfo[key] = result[0][0][key]
            else if(n>18 && n<=24) caseInfo[key] = result[0][0][key]
            else if(n>24 && n<=26) courtInfo[key] = result[0][0][key]
            else if(n>26 && n<=29) jailInfo[key] = result[0][0][key]
            else policeInfo[key] = result[0][0][key]
            n++;
        }
        let sql = `CALL GetCriminalInfo(${result[0][0]['Criminal ID']},'crID')`;
        con.query(sql, function (err, criminalInfo) {
            if (err) {
                res.status(400);
                return;
            };
            criminalInfo[0][0].frontProfile = `images/${criminalInfo[0][0].CNIC}-frontProfileImage.jpg`;
            criminalInfo[0][0].leftProfile = `images/${criminalInfo[0][0].CNIC}-leftProfileImage.jpg`;
            criminalInfo[0][0].rightProfile = `images/${criminalInfo[0][0].CNIC}-rightProfileImage.jpg`;

            res.send({ "criminal": criminalInfo[0][0], "crime": crimeInfo, "fir":firInfo,
            'ps':psInfo,'case':caseInfo,'court':courtInfo,'jail':jailInfo,'po':policeInfo });
            })
            logsController.log(req.session.username, "generated a crime report", '');
        });

    }
module.exports.genCrimeReport = genCrimeReport;
    module.exports.getCrimeReport = getCrimeReport;