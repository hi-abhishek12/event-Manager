const db = require("../../model/web/webModel");
const webController = require("../../model/web/webModel");


async function homeRoute(req, res) {
  const data = await webController.upComingEvents();
  res.render("index", { data });
}

function createEventRoute(req, res) {
  res.render("createEvent");
}

// async function eventBook(req , res) {
//   try {
//     const eventId = req.body.event_id;
//     const userId  = req.session.user_id;
//     const event = await getEventById(eventId);

//     if(event.available_seats > 0){
//       await db.bookSeat(eventId , userId)
//         res.redirect('/dashboard')
//     }else{
//       res.redirect('/dashboard?error=noSeats');
//     }

//   } catch (error) {
//     console.log(`event booking error`,error);
//   }
// }

module.exports = {
  homeRoute,
  createEventRoute,
  // eventBook
};
