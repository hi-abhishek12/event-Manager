const express = require("express");
const mysql = require("mysql2/promise");
const path = require('path');

const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Serve Static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.urlencoded({ extended: true }));

// Routing

const route = require('./routes/webRoute')
app.use('/',route);




app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

