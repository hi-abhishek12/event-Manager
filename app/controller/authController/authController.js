const Joi = require("joi");
const mysql = require("mysql2/promise");
const dbconfig = require("../../config/dbconfig");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

function authenticated(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
}

async function loginRender(req, res) {
  try {
    res.render("login", {
      data: {},
      lockInfo: null,
    });
  } catch (err) {
    console.error("Login Render Error:", err);
    res.render("login", {
      data: { error: "Unexpected error occurred" },
      lockInfo: null,
    });
  }
}

async function login(req, res) {
  try {
    const connection = await mysql.createConnection(dbconfig);

    //  Input validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.render("login", { data: { error: error.details[0].message } });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("login", { data: { error: "Email and Password required" } });
    }

    //  Get user from DB
    const [users] = await connection.query("SELECT * FROM auth WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.render("login", { data: { error: "User not found" } });
    }

    const user = users[0];

    //  Check if user is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.render("login", { data: { error: `User locked until ${user.locked_until}` } });
    }

    //  Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const lockInfo = await lockUserOnFailedAttempts(connection, user);
      return res.render("login", { data: { error: lockInfo.message } });
    }

    //  Reset attempts and create session token
    await connection.query("UPDATE auth SET pass_attempts = 0 WHERE id = ?", [user.id]);
    const sessionToken = crypto.randomBytes(32).toString("hex");
    await connection.query("UPDATE auth SET session_token = ? WHERE id = ?", [sessionToken, user.id]);

    //  Save session
    req.session.user = { id: user.id, email: user.email, token: sessionToken,role: user.role,};
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.render("login", { data: { error: "Session error. Please try again." } });
      }
      // Redirect only after session is saved
      return res.redirect("/");
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.render("login", { data: { error: "Unexpected error occurred" } });
  }
}
//  Handles failed attempts and locks user if necessary

async function lockUserOnFailedAttempts(connection, user) {
  const allowedAttempts = 5;
  const lockPeriodMinutes = 15;

  if (user.pass_attempts + 1 >= allowedAttempts) {
    const lockUntil = new Date(Date.now() + lockPeriodMinutes * 60000);
    await connection.query(
      "UPDATE auth SET pass_attempts = 0, locked_until = ? WHERE id = ?",
      [lockUntil, user.id]
    );
    return {
      status: "locked",
      message: `User locked until ${lockUntil}. Please try again later.`,
    };
  } else {
    await connection.query(
      "UPDATE auth SET pass_attempts = pass_attempts + 1 WHERE id = ?",
      [user.id]
    );
    return {
      status: "failed",
      message: `Incorrect password. Failed attempts: ${
        user.pass_attempts + 1
      } of ${allowedAttempts}`,
    };
  }
}

async function logout(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(`Error in destroying Session`, err);
      res.redirect("/");
    } else {
      res.clearCookie("connect.sid", { path: "/" });
      res.redirect("/login");
    }
  });
}

module.exports = {
  authenticated,
  login,
  loginRender,
  logout,
};
