const jwt = require('jsonwebtoken');
const config = require('./config.json');
const getToken =  require('./authToken');

module.exports = function checkAuth(req, res, next) {
  const token = getToken(req);

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) 
    {
      req.session.loggedin = false; // jwt expires
      res.cookie('IsLoggedIn', 'false');
      return res.redirect('/');
    }
    // console.log(req.session.username);
    // console.log(decoded.username)
    if (decoded.username == req.session.username && req.session.loggedin == true) {
      next();
    }
    else {
      req.session.loggedin = false;
      res.cookie('IsLoggedIn', 'false');
      res.redirect('/');
    }
  });
}

