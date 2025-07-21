const db = require("../model/webModel");
const webController = require("../model/webModel");

async function homeRoute(req, res) {
  const data = await webController.upComingEvents();
  res.render("index", { data });
}

function createEventRoute(req, res) {
  res.render("createEvent");
}

function signup(req , res){
    res.render("signUp")
}

function login(req , res){
    res.render("login")
}
module.exports = {
  homeRoute,
  createEventRoute,
  signup,
  login
};
