const con = require('../connection/connection');
function viewPersonDetail(req, res)
{
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    res.render('viewPersonDetails', { username: username, firstname: firstname, lastname: lastname, post: post});

}
function searchPersonDetail(req, res)
{
    const cnic = req.query.cnic;
    let sql = `CALL GetPersonDetails('${cnic}')`;
    con.query(sql, function (err, result, fields) {
        if (err)
        {
            res.status(404).send("CNIC NOT FOUND!");
            return;
        };
        res.send(result[0][0]);
    });
}

function getPersonName(req, res)
{
    const cnic = req.query.cnic;
    let sql = `CALL GetPersonName(${cnic})`;
    con.query(sql, function (err, result, fields) {
        if (err)
        {
            res.status(404).send("CNIC NOT FOUND!");
            return;
        };
        res.send(result[0][0]);
    });
}
module.exports.getPersonName = getPersonName;
module.exports.searchPersonDetail = searchPersonDetail;
module.exports.viewPersonDetail = viewPersonDetail;