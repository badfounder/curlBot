const express = require("express");
const router = express.Router()
var db = require('../data/db_config.js')
var cors = require('cors')

// GET /teams
router.get("/", (req, res) => {
    const sql = "SELECT * FROM teams ORDER BY teamID";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("teams", { model: rows });
    });
  });

// GET /create teams
router.get("/create", (req, res) => {
  res.render("create", { model: {} });
});


// POST /create teams 
router.post("/create", cors(), (req, res) => {
  // console.log(req.body)
  const sql = "INSERT OR IGNORE INTO teams (teamID,win,lose,ptsFor,ptsAgainst,hamEff,stlDef,ccID,gender) VALUES (?,?,?,?,?,?,?,?,?)";
 const thing = [req.body.teamID, req.body.win, req.body.lose, req.body.ptsFor, req.body.ptsAgainst, req.body.hamEff,req.body.stlDef,req.body.ccID, req.body.gender];
  db.run(sql,thing, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/teams");
  });
});


// GET /edit/5
router.get("/edit/:id", (req, res) => {
  const ident = req.params.id;
  const sql = "SELECT * FROM teams WHERE id = ?";
  db.get(sql, ident, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: row });
  });
});

// POST /edit/5
router.post("/edit/:id", (req, res) => {
  const ident = req.params.id;
  const team = [req.body.teamID, req.body.win, req.body.lose, req.body.ptsFor, req.body.ptsAgainst, req.body.hamEff,req.body.stlDef, req.params.id];
  const sql = "UPDATE teams SET teamID = ?, win = ?,  lose = ?, ptsFor = ?, ptsAgainst = ?,  hamEff = ?, stlDef = ?  WHERE (id = ?)";
  db.run(sql, team, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/teams");
  });
});

// GET /delete/5
router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM teams WHERE (id = ?)";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: row });
  });
});

// POST /delete/5
router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM teams WHERE (id = ?)";
  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/teams");
    console.log(id)
  });
});


/// Games Endpoints

// // POST /games/create
// app.post("/games/mlbets/create", (req, res) => {
//   const sql = "INSERT OR IGNORE INTO OubBts (gameID,tournament,date,team1,team2,ovUnd,ovUndLine,draw,ccUUID,gender,ccIDteam1,ccIDteam2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//   const thing = [req.body.gameID, req.body.tournament, req.body.date, req.body.team1, req.body.team2, req.body.ovUnd,req.body.ovUndLine,req.body.draw,req.body.ccUUID,req.body.gender,req.body.ccIDteam1,req.body.ccIDteam2,req.body.ouBet,
//   req.body.betAmount,req.body.adjEdge,req.body.scoreHedge ];
//    db.run(sql,thing, err => {
//      if (err) {
//        return console.error(err.message);
//      }
//      res.redirect("/games");
//    });
//  });

 module.exports = router;