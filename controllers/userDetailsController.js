const con = require('../connection/connection');

function searchUser(req, res)
{
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    res.render('searchUser', { username: username, firstname: firstname, lastname: lastname, post: post});
}

function processSearchUser(req, res)
{
    const username = req.query.username;
    let sql = `CALL GetUserInfo('${username}')`;
    con.query(sql, function (err, result, fields) {
        if (err)
        {
            res.status(404).send("An Error Occurred!");
            return;
        };
        if(result[0][0] == null)
        {
            res.status(404).send("USER NOT FOUND!");
            return;
        }
        res.send(result[0][0]);
    });
}

function getAllUsers(req, res)
{
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    let sql = `CALL GetAllUsers(${null})`;
    con.query(sql, function (err, result, fields) {
        if (err)
        {
            res.status(404).send("An Error Occurred!");
            return;
        };
        res.render('viewAllUsers', { username: username, firstname: firstname, lastname: lastname, post: post, users: result[0]});
    });
}

function getMoreUsers(req, res)
{
    const last_id = req.query.last_id;
    let sql = `CALL GetAllUsers('${last_id}')`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(result[0]);
    });
}

module.exports.getMoreUsers = getMoreUsers;
module.exports.processSearchUser = processSearchUser;
module.exports.getAllUsers = getAllUsers;
module.exports.searchUser = searchUser;