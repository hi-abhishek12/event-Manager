const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const Joi = require("joi");
const session = require('express-session')
const dbconfig = require('../../config/dbconfig')

async function signup(req, res) {
  const data = {};

  try {
    const connection = await mysql.createConnection(dbconfig);
    const { username, email, password } = req.body;


    const signUpSchema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
        .required(),
    });

    const validation = signUpSchema.validate(req.body);
    if (validation.error) {
      data.error = validation.error.details[0].message;
      await connection.end();
      return res.render("signUp", { data });
    }

   
    const [existingUser] = await connection.query(
      "SELECT * FROM auth WHERE email = ?", [email]
    );

    if (existingUser.length > 0) {
      data.error = "User already exists";
      await connection.end();
      return res.render("signUp", { data });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    let is_Active = true;
    const [result] = await connection.query(
      "INSERT INTO auth (username, email, password , is_Active) VALUES (?, ?, ?,?)",
      [username, email, hashPassword, is_Active]
    );

    req.session.user = { id: result.insertId, username, email };
    await connection.end();

    req.session.cookie.expires = new Date(Date.now() + 2 * 3600000);
    req.session.cookie.maxAge = 2 * 3600000;

    req.session.save((err) => {
      if (err) {
        console.error("Session Save Error:", err);
        data.error = "Session could not be created.";
        return res.render("signUp", { data });
      }
      return res.redirect("/");
    });


  } catch (error) {
    console.error("Signup Error:", error);
    data.error = "Internal Server Error";
    return res.render("signUp", { data });
  }
}

module.exports = {
  signup,
};
