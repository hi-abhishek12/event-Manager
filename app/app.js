const express = require("express");
const mysql = require("mysql2/promise");
const path = require('path');
const session = require('express-session')
const app = express();
const port = 3000;
const MySQLStore = require("express-mysql-session")(session);
const dbconfig = require('../app/config/dbconfig')

app.set("view engine", "ejs");

// Serve Static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));


// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// app.set('trust proxy', 1);
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true, maxAge: 3600000 },
//   rolling: true
// }))
const sessionStore = new MySQLStore(dbconfig);
app.use(
  session({
    key: "connect.sid",           // cookie name
    secret: "mySecretKey123",     // keep it strong & secure
    store: sessionStore,          // here we pass the store
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 3600000,        // 2 hours
      httpOnly: true,
      secure: false               // keep false for localhost
    }
  })
);


// Routing
const route = require('./routes/webRoute')
app.use('/',route);
app.use('/user/signup',require('./routes/webRoute'));



app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

