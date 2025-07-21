const express = require('express');
const mysql = require("mysql2/promise");


const dbconfig = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "eventManager",
};

async function upComingEvents() {
  const connection = await mysql.createConnection(dbconfig);

  const result = await connection.query(
    "SELECT * FROM eventManager.appUsers"
  );
  connection.end()
  return result[0];

}

async function createEventFormSubmit(req , res) {
  try {
    const connection = await mysql.createConnection(dbconfig);
    
    const { title, description, date, time, location, available_seats, img } = req.body;

    const sqlCmd = `
      INSERT INTO appUsers (title, description, date, time, location, available_seats, img) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await connection.query(sqlCmd, [
      title,
      description,
      date,
      time,
      location,
      available_seats,
      img
    ]);

    // Redirect to Home Page
    res.redirect("/");
    await connection.end();
    
  } catch (error) {
    console.log(`data base error`, error);
    res.status(500).send("Database error: " + error.message); 
  }
}


module.exports = {
  upComingEvents,
  createEventFormSubmit
};
