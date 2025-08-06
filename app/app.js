const express = require("express");
const mysql = require("mysql2/promise");
const path = require('path');
const session = require('express-session')
const app = express();
const port = 3000;
const MySQLStore = require("express-mysql-session")(session);
const dbconfig = require('../app/config/dbconfig');
// const { authentication } = require("./middleware/authentication");

app.set("view engine", "ejs");

// Serve Static files

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));


// middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const sessionStore = new MySQLStore(dbconfig);
app.use(
  session({
    key: "connect.sid",         
    secret: "mySecretKey123",     
    store: sessionStore,          
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 3600000,       
      httpOnly: true,
      secure: false               
    }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session ? req.session.user : null;
  next();
});


// app.use(authentication);

// Routing

app.use('/',require('./routes/webRoute'));
app.use('/user',require('./routes/webRoute'));
app.use('/admin',require('./controller/bread/bread'))



app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

