const mysql = require("mysql2/promise");

const dbconfig = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "eventManager",
};

async function upComingEvents() {
  const connection = await mysql.createConnection(dbconfig);

  const result = await connection.query(
    "SELECT * FROM eventManager.appUsers"
  );
  connection.end()
  return result[0];

}

module.exports = {
  upComingEvents,
};
