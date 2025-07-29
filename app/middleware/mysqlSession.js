
const dbconfig = require('../config/dbconfig');

const sessionStore = new MySQLStore(dbconfig);

function mysqlSession() {
    session({
        key: "connect.sid",             // Cookie name
        secret: "mySecretKey123",       // Change this to a strong secret
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 2 * 3600000,          // 2 hours
            httpOnly: true,
            secure: false                 // must be false on localhost
        }
    })

}

module.exports = {
    mysqlSession
}

