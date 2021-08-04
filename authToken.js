module.exports = function (req) {
  if(req.headers.cookie != null){
    var cookies = req.headers.cookie.split('; ');
  }
  else
  {
    return;
  }
    var token = null;
    cookies.forEach(cookie => {
  
      var propertyValue = cookie.split('=');
      if (propertyValue[0] == 'Token') {
        token = propertyValue[1];
  
      }
    });
    return token;
  }