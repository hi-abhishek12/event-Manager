const express = require("express");
const mysql = require("mysql2/promise");
const path = require('path');
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.get("/", async (req, res) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "eventManager",
  });
  
  let result = await connection.query('SELECT * FROM eventManager.appUsers')
  connection.end();

  res.render('index',{data : result[0]})
});

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
