const express = require('express');
const router = require('./routes/routes')
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const MySQLStore = require('express-mysql-session')(session);
const con = require('./connection/connection')


const app = express()
const port = process.env.PORT || 8081;
const sessionStore = new MySQLStore({},con);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());
// app.use(cookieParser('123456cat'));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({ 
  key: 'userId',
  secret: '123456cat',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { 
    httpOnly:false,
    // sameSite: "none",
    // secure: true,
    expires: 1000*60*60*24 //10 minutes
   }
}))

app.use(flash());

// app.all('/admin_*', (req,res, next) => {res.redirect('/')});
app.use('/',router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})




// scripts/authorization handler and connection/connection.js, config.json, email controller needs to be updated before deployment