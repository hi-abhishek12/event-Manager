const dbconfig = require("../../config/dbconfig");
const mysql = require("mysql2/promise");
const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multerConfig");

//Create Event

router.post("/create-event-submit",upload.single('img'), async(req, res)=>{
  try {
 
    const connection = await mysql.createConnection(dbconfig);

    const { title, description, price, date, time, location, available_seats,  } =
      req.body;
      const img = req.file.filename

    const sqlCmd = `
      INSERT INTO cards (title, description, price, date, time, location, available_seats, img) 
      VALUES (?, ?, ?, ?, ?, ?, ?,?)`;

    await connection.query(sqlCmd, [
      title,
      description,
      price,
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
})


// Delete Card Function

router.post("/delete/:id", async function (req, res) {
  const { id } = req.params;
  const connection = await mysql.createConnection(dbconfig);

  try {
    await connection.query("DELETE FROM cards WHERE event_id = ?", [id]);
    await connection.end();
    res.redirect("/");
  } catch (error) {
    console.log(`error in delete function`, error);
    res.status(500).send("Internal Server Error");
  }
});

// Edit Card Function

router.get("/edit/:id", async function (req, res) {
  const { id } = req.params;
  const connection = await mysql.createConnection(dbconfig);

  try {
    const [rows] = await connection.query(
      "SELECT * from cards where event_id = ?",
      [id]
    );
    connection.end();

    if (rows.length == 0) {
      return res.status(404).send("Card not found");
    } else {
      res.render("edit", { card: rows[0] });
    }
  } catch (error) {
    console.log(`error in Edit function`, error);
    res.status(500).send("Internal Server Error");
  }
});

//Update Card Function

router.post("/edit/:id", upload.single("img"), async function (req, res) {
  const { id } = req.params;
  const connection = await mysql.createConnection(dbconfig);

  try {
    const {
      title,
      description,
      date,
      time,
      location,
      available_seats,
      old_image,
    } = req.body;

    let img = old_image;

    if (req.file) {
      img = req.file.filename;
    }

    await connection.query(
      "UPDATE cards SET title=?, description=?, location=?, date=?, time=?, available_seats=?,img=? WHERE event_id=?",
      [title, description, location, date, time, available_seats, img, id]
    );
    res.redirect("/");
  } catch (error) {
    console.log(`error in update function`, error);
    res.status(500).send("Internal Server Error");
  }
});



module.exports = router;
