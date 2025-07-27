const express = require("express");
const mysql = require("mysql2/promise");

const dbconfig = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "eventManager",
};


async function upComingEvents() {
  const connection = await mysql.createConnection(dbconfig);

  const result = await connection.query("SELECT * FROM eventManager.cards");
  connection.end();
  return result[0];
}

async function createEventFormSubmit(req, res) {
  try {
 
    const connection = await mysql.createConnection(dbconfig);

    const { title, description, date, time, location, available_seats,  } =
      req.body;
      const img = req.file.filename

    const sqlCmd = `
      INSERT INTO cards (title, description, date, time, location, available_seats, img) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await connection.query(sqlCmd, [
      title,
      description,
      date,
      time,
      location,
      available_seats,
      img,
    ]);

    // Redirect to Home Page
    res.redirect("/");
    await connection.end();
  } catch (error) {
    console.log(`data base error`, error);
    res.status(500).send("Database error: " + error.message);
  }
}


// async function bookSeat(eventId, userId) {
//   // Decrease available seats
//   await db.query(`
//     UPDATE cards 
//     SET available_seats = available_seats - 1 
//     WHERE id = ? AND available_seats > 0
//   `, [eventId]);

//   // Insert booking record
//   await db.query(`
//     INSERT INTO bookings (user_id, event_id, booked_at)
//     VALUES (?, ?, NOW())
//   `, [userId, eventId]);
// }


module.exports = {
  upComingEvents,
  createEventFormSubmit,
  // bookSeat
};
