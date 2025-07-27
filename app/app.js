const express = require("express");
const mysql = require("mysql2/promise");
const path = require('path');
const session = require('express-session')
const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Serve Static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));


// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 3600000 },
  rolling: true
}))

// Routing
const route = require('./routes/webRoute')
app.use('/',route);


app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

