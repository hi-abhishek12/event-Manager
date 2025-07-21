const db = require("../../model/webModel");
const webController = require("../../model/webModel");

async function homeRoute(req, res) {
  const data = await webController.upComingEvents();
  res.render("index", { data });
}

function createEventRoute(req, res) {
  res.render("createEvent");
}


module.exports = {
  homeRoute,
  createEventRoute,

};
