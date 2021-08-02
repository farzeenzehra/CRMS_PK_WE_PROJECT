module.exports = function (req) {
  
    var cookies = req.headers.cookie.split('; ');
    var token = null;
    cookies.forEach(cookie => {
  
      var propertyValue = cookie.split('=');
      if (propertyValue[0] == 'Token') {
        token = propertyValue[1];
  
      }
    });
    return token;
  }