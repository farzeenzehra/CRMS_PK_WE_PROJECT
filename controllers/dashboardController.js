const con = require('../connection/connection')

function getDashboard(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;

    let sql = "CALL GetRecentLogs()";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.setHeader('Cache-Control', 'no-store');
        res.render('dashboard', { username: username, firstname: firstname, lastname: lastname, post: post, logs:result[0]});
    })

};


module.exports.getDashboard = getDashboard;