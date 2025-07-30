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

// CRUD OPERATIONS

// app.put("/api/cards/:id", (req, res) => {
//   const { id } = req.params;
//   const { title } = req.body;
//   const card = cards.find(c => c.id == id);
//   if (!card) return res.status(404).json({ error: "Not found" });
//   card.title = title;
//   res.json(card);
// });


// Routing

const route = require('./routes/webRoute')
app.use('/',route);
app.use('/user',require('./routes/webRoute'));
app.use('/admin',require('./controller/bread/bread'))



app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

