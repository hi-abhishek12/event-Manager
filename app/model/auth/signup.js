const express = require("express");
const mysql = require("mysql2/promise");

const dbconfig = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "eventManager",
};

async function signup(req, res) {
  try {
    const connection = await mysql.createConnection(dbconfig);

    const { username, email, password } = req.body;
    const sqlCmd = `INSERT INTO auth (username, email, password)
                   VALUES (?, ?, ?);`;

    await connection.query(sqlCmd, [username, email, password]);
    // Redirect to Home Page

    res.redirect("/");
    await connection.end();
  } catch (error) {
    console.log(`data base signup error`, error);
  }
}
module.exports = {
  signup,
};
