const db = require("../../model/web/webModel");
const webController = require("../../model/web/webModel");
const express = require('express');
const mysql = require('mysql2/promise');
const dbconfig = require('../../config/dbconfig');

// Home Route
async function homeRoute(req, res) {
  const events = await webController.upComingEvents();
  res.render("index", { events });   // ✅ send array directly
}

// Create Event Page
function createEventRoute(req, res) {
  res.render("createEvent");
}

// Search Route
async function search(req, res) {
  const qs_search = req.query.search || '';
  console.log("Searching for:", qs_search);

  const connection = await mysql.createConnection(dbconfig);

  // ✅ Correct way to destructure results from mysql2
  const [events] = await connection.query(
    "SELECT * FROM cards WHERE title LIKE ?",
    [`%${qs_search}%`]
  );
  await connection.end();

  console.log("Fetched Events:", events);

  // ✅ Send data as separate variables (easier in EJS)
  res.render('index', {
    events,             // Array of events
    qs_search           // Search term
  });
}

module.exports = {
  homeRoute,
  createEventRoute,
  search
};
