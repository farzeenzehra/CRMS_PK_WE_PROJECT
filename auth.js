const jwt = require('jsonwebtoken');
const config = require('./config.json');
const getToken = require('./authToken');

module.exports = function checkAuth(req, res, next) {
  const token = getToken(req);

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      req.session.loggedin = false; // jwt expires
      res.cookie('IsLoggedIn', 'false');
      return res.redirect('/');
    }
    // console.log(req.session.username);
    // console.log(decoded.username)
    if (decoded.username == req.session.username && decoded.post == req.session.post && req.session.loggedin == true) {
      
      adminSpecificRoutes = ['/addUser','/view_all_logs','/view_more_logs','/search_user','/process_search_user','/view_users','/view_more_users','/add_user','/create_account','/get_username']
      subAdminSpecificRoutes = ['/add_crime_type','/view_all_logs','/view_more_logs','/process_add_crime','/update_crime_type','/process_update_crime','/get_crime_laws','/view_crime_type']
      poSrSpecificRoutes = ['/add_criminal_record','/process_add_criminal_rec','/update_criminal_record','/get_criminal_info','/process_upd_criminal_rec','/add_crime_record','/process_add_crime_rec','/update_crime_record','/get_crimes_of_criminal','/get_crime_rec_info','/process_upd_crime_rec']
      if (adminSpecificRoutes.includes(req.url)) {
        if (decoded.post == "Administrator") next();
        else return res.redirect('/dashboard');
      }
      else if (subAdminSpecificRoutes.includes(req.url)) {
        if (decoded.post == "Sub-Administrator") next();
        else return res.redirect('/dashboard');
      }
      else if (poSrSpecificRoutes.includes(req.url)) {
        if (decoded.post == "Police Officer Sr.") next();
        else return res.redirect('/dashboard');
      }
      else {
        next();
      }
    }
    else {
      req.session.loggedin = false;
      res.cookie('IsLoggedIn', 'false');
      res.redirect('/');
    }
  });
}

