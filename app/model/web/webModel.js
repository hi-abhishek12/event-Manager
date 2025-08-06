const express = require("express");
const mysql = require("mysql2/promise");
const dbconfig = require('../../config/dbconfig')

async function upComingEvents() {
  const connection = await mysql.createConnection(dbconfig);

  const result = await connection.query("SELECT * FROM eventManager.cards");
  connection.end();
  return result[0];
}


module.exports = {
  upComingEvents,
  // bookSeat
};
