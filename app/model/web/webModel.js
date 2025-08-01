const express = require("express");
const mysql = require("mysql2/promise");
const dbconfig = require('../../config/dbconfig')

async function upComingEvents() {
  const connection = await mysql.createConnection(dbconfig);

  const result = await connection.query("SELECT * FROM eventManager.cards");
  connection.end();
  return result[0];
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
  // bookSeat
};
