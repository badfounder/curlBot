const express = require("express");
const router = express.Router();
var db = require("../data/db_config.js");

// GET/OUBets
router.get("/OUBETS", (req, res) => {
  getAllFromTable("OuBets", "id");
  res.render("ouBets", { model: rows });
  console.log(rows);
});

// function to ge
async function getAllFromTable(table, order) {
  const sql = `SELECT * FROM ${table} ORDER BY ${order}`;
  rows = await db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(rows);
    return rows;
  });
}

getAllFromTable("OuBets", "id");

module.exports = router;
