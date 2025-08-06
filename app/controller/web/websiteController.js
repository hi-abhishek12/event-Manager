const db = require("../../model/web/webModel");
const webController = require("../../model/web/webModel");
const mysql = require("mysql2/promise");
const dbconfig = require("../../config/dbconfig");


// Home Route
async function homeRoute(req, res) {
  const events = await webController.upComingEvents();
  res.render("index", { events });
}

// Create Event Page
function createEventRoute(req, res) {
  res.render("createEvent");
}

// Search Route

async function search(req, res) {
  const qs_search = req.query.search || "";
  console.log("Searching for:", qs_search);

  const connection = await mysql.createConnection(dbconfig);

  const [events] = await connection.query(
    "SELECT * FROM cards WHERE title LIKE ?",
    [`%${qs_search}%`]
  );
  await connection.end();

  //  Send data as separate variables (easier in EJS)

  res.render("index", {
    events,
    qs_search,
  });
}

async function booking(req, res) {
 try {
   const connection = await mysql.createConnection(dbconfig);
   const [events] = await connection.query(
     "SELECT * FROM cards WHERE event_id = ?",
     [req.params.event_id]
   );
   console.log("Event ID received:", req.params.event_id);
 
   if (events.length === 0) {
     await connection.end();
     return res.status(404).send("Event not found");
   }
 
   const event = events[0];
   event.dateFormatted = new Date(event.date).toDateString();
   event.timeFormatted = new Date(`1970-01-01T${event.time}`).toLocaleTimeString(
     [],
     { hour: "2-digit", minute: "2-digit" }
   );
 
   if (req.session.user) {
     res.render("booking", { event: events[0], user: req.session.user });
   } else {
     res.redirect("/login");
   }
 
   await connection.end();
 } catch (error) {
   console.error("Booking Error:", error);
   res.status(500).send("Internal Server Error");
 }
}

async function confirmBooking(req, res) {
 try {
   const userEmail = req.session.user.email;
   const {event_id} = req.params;
   const {no_of_tickets} = req.body;
   const connection = await mysql.createConnection(dbconfig);
 
   const [events] = await connection.query("SELECT * FROM cards WHERE event_id = ?", [event_id]);
   const event = events[0];
   const total_price =  event.price*no_of_tickets;

   let book_at = new Date()
 
   await connection.query(
     "INSERT INTO bookings (event_id, email, no_of_tickets, total_price, payment_status, book_at) VALUES (?, ?, ?, ?, ?, ?)",
     [event_id, userEmail , no_of_tickets, total_price, "paid",book_at]
   );
 
   await connection.query(
   "UPDATE cards SET available_seats = available_seats - ? WHERE event_id = ?",
   [no_of_tickets, event_id]
 );


const [bookings] = await connection.query(
  `SELECT 
       b.booking_id,
       b.no_of_tickets,
       b.total_price,
       b.payment_status,
       b.book_at,
       c.title AS event_title,
       c.location AS event_location,
       c.date AS event_date,
       c.time AS event_time,
       c.price AS ticket_price
   FROM bookings b
   JOIN cards c ON b.event_id = c.event_id
   WHERE b.email = ?
   ORDER BY b.book_at DESC`,
  [userEmail]
);

  connection.end();

  res.render('myBookings',{bookings});

 } catch (error) {
   console.error("Confirm Booking Error:", error);
   res.status(500).send("Internal Server Error");
 }

}

// Handle GET Request of Confirm Booking Function

async function myBookings(req, res) {
  if (!req.session.user) return res.redirect('/login');

  try {
    const userEmail = req.session.user.email;
    const connection = await mysql.createConnection(dbconfig);

    const [bookings] = await connection.query(
      `SELECT 
         b.booking_id,
         b.no_of_tickets,
         b.total_price,
         b.payment_status,
         b.book_at,
         c.title AS event_title,
         c.location AS event_location,
         c.date AS event_date,
         c.time AS event_time,
         c.price AS ticket_price
       FROM bookings b
       JOIN cards c ON b.event_id = c.event_id
       WHERE b.email = ?
       ORDER BY b.book_at DESC`,
      [userEmail]
    );

    await connection.end();

    res.render('myBookings', { bookings });

  } catch (error) {
    console.error("MyBookings Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function cancelBooking(req, res) {
  if(!req.session.user) res.redirect('/login');

  const userEmail = req.session.user.email
  const bookingId = req.params.booking_id;

  try {
    const connection = await mysql.createConnection(dbconfig);

      const [booking] = await connection.query(
      "SELECT * FROM bookings WHERE booking_id = ? AND email = ? AND booking_status = ?",
      [bookingId, userEmail,'active']
    );
    console.log("Fetched Booking:", booking);
    console.log("Params:", bookingId, userEmail);



      if (booking.length === 0) {
      await connection.end();
      return res.status(403).send("Booking not found or already cancelled.");
    }

      await connection.query(
      "UPDATE cards SET available_seats = available_seats + ? WHERE event_id = ?",
      [booking[0].no_of_tickets, booking[0].event_id]
    );

      await connection.query(
      "UPDATE bookings SET booking_status = 'cancelled' WHERE booking_id = ?",
      [bookingId]
    );


  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  homeRoute,
  createEventRoute,
  search,
  booking,
  confirmBooking,
  myBookings,
  cancelBooking
};
