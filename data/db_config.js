const sqlite3 = require("sqlite3").verbose();
const path = require("path");

let db_name = path.join(__dirname,"apptest.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connection Established 'apptest.db'");
}); 

module.exports = db



 