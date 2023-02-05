const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
const bankRoll = 1000

//Express Server Creation
const app = express();

// Server Congfiguration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }))

// Create the DB from SQQLITE
const db_name = path.join(__dirname, "data", "apptest.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connection is estabilised to 'apptest.db'");
});

// Création de la table Livres (Livre_ID, Titre, Auteur, Commentaires)
const sql_create = `CREATE TABLE IF NOT EXISTS teams ( 
    "id" INTEGER PRIMARY KEY,
    "teamID" VARCHAR UNIQUE, 
    "win" REAL, 
    "lose" REAL, 
    "winPer" REAL as (ROUND("win"/("win"+"lose"),2)), 
    "ptsFor" REAL, 
    "ptsAgainst" REAL, 
    "netScore" REAL as (ROUND("ptsFor" - "ptsAgainst",2)), 
    "hamEff" REAL,
    "stlDef" REAL,
    "netEff" REAL as (ROUND("hamEff" - "stlDef",2)) 
);`;

db.run(sql_create, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Creation of Table 'teams'");
  
 //Create a second table for the games.
 
  const sql_create2 = `
  CREATE TABLE IF NOT EXISTS games ( 
    "id" INTEGER PRIMARY KEY,
    "gameID" VARCHAR UNIQUE, 
    "tournament" INT, 
    "date" TEXT, 
    "team1" TEXT, 
    "team2" TEXT, 
    "ovUnd" REAL, 
    "ovUndLine" REAL, 
    "team1StraightOdds" REAL,
    "team2StraightOdds" REAL, 
    "team1SpreadOdds" REAL,
    "team2SpreadOdds" REAL,
    "ptsSprd" REAL
  )`;

db.run(sql_create2, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Creation of Table 'games'");
})
  
  // Alimentation de la table
  const sql_insert = `INSERT OR IGNORE INTO teams (teamID,win,lose,ptsFor,ptsAgainst,hamEff,stlDef) VALUES
  ("Edin",61,13,8.55,5.42,0.48,0.15),
  ("Gim",54,20,8.83,5.72,0.51,0.14),
  ("Constantini",34,20,8.08,5.99,0.4,0.25)
  ;`;
  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Seeded Data into Teams Table");
  });
});

  // feed the games table
  const sql_insert = `INSERT OR IGNORE INTO games (gameID,tournament,date,team1,team2,ovUnd,ovUndLine,team1StraightOdds,team2StraightOdds,team1SpreadOdds,team2SpreadOdds,ptsSprd) VALUES
  ("game1","CADOPEN23","10/01/2023","Gim","Constantini","10.5","1.72","1.3","3.2","1.65","2.1","-1.5")
  ;`

  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Seeded Data into Games Table");
  });



// Launch the server
app.listen(3000, () => {
    console.log("Server started (http://localhost:3000/) !");
  });

// GET /
app.get("/", (req, res) => {
  // res.send("Bonjour le monde...");
  res.render("index");
});


// GET /teams
app.get("/teams", (req, res) => {
    const sql = "SELECT * FROM teams ORDER BY teamID";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("teams", { model: rows });
    });
  });

  // GET /games
app.get("/games", (req, res) => {
  const sql = "SELECT * FROM games ORDER BY gameID";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("games", { model: rows })
   ;
  });
});

// GET /create teams
app.get("/teams/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create teams 
app.post("/teams/create", (req, res) => {
 const sql = "INSERT OR IGNORE INTO teams (teamID,win,lose,ptsFor,ptsAgainst,hamEff,stlDef) VALUES (?,?,?,?,?,?,?)";
 const thing = [req.body.teamID, req.body.win, req.body.lose, req.body.ptsFor, req.body.ptsAgainst, req.body.hamEff,req.body.stlDef];
  db.run(sql,thing, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/teams");
  });
});


// GET /edit/5
app.get("/edit/:id", (req, res) => {
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
app.post("/edit/:id", (req, res) => {
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
app.get("/delete/:id", (req, res) => {
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
app.post("/delete/:id", (req, res) => {
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

// GET /create
app.get("/games/create", (req, res) => {
  res.render("creategame", { model: {} });
});

// POST /games/create
app.post("/games/create", (req, res) => {
 const sql = "INSERT OR IGNORE INTO games (gameID,tournament,date,team1,team2,ovUnd,ovUndLine,team1StraightOdds,team2StraightOdds,team1SpreadOdds,team2SpreadOdds,ptsSprd) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
 const thing = [req.body.gameID, req.body.tournament, req.body.date, req.body.team1, req.body.team2, req.body.ovUnd,req.body.ovUndLine,req.body.team1StraightOdds,req.body.team2StraightOdds,req.body.team1SpreadOdds,req.body.team2SpreadOdds.ptsSprd];
  db.run(sql,thing, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/teams");
  });
});
// GET /games/edit/5
app.get("/games/edit/:id", (req, res) => {
  const ident = req.params.id;
  const sql = "SELECT * FROM games WHERE id = ?";
  db.get(sql, ident, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("editgames", { model: row });
  });
});

app.post("/games/edit/:id", (req, res) => {
  const ident = req.params.id;
  const team = [req.body.gameID, req.body.tournament, req.body.date, req.body.team1, req.body.team2, req.body.ovUnd,req.body.ovUndLine,req.body.team1StraightOdds,req.body.team2StraightOdds,req.body.team1SpreadOdds,req.body.team2SpreadOdds, req.body.ptsSprd, req.params.id];
  const sql = "UPDATE games SET gameID = ?, tournament = ?,  date = ?, team1 = ?, team2 = ?,  ovUnd = ?, ovUndLine = ?, team1StraightOdds = ? , team2StraightOdds =?, team1SpreadOdds = ? , team2SpreadOdds =?, ptsSprd = ?  WHERE (id = ?)";
  db.run(sql, team, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/games");
  });
});

// GET /delete/5
app.get("/games/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM games WHERE (id = ?)";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: row });
  });
});

// POST /delete/5
app.post("/games/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM games WHERE (id = ?)";
  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/games");
    console.log(id)
  });
});




/// Get the game and both teams
function getGames(req, res, next) {
  var dbRequest = 'SELECT * FROM games WHERE id = ?'
  var param = req.params.id;
  db.get(dbRequest,param, function(error, rows) {
      if(rows.length !== 0) {
          req.games = rows;
          // console.log(req.games)
          return next();
          
      }

  });
}

function findTeam1(req, res, next) {
  dbRequest = 'SELECT * FROM teams WHERE teamID = \'' + req.games.team1 + '\'';
      db.get(dbRequest, function(error, rows) {
          /* Add selected data to previous saved data. */
          req.team1 = rows;
          // console.log(req.team1)
          next();
      });
  }

  function findTeam2(req, res, next) {
    dbRequest = 'SELECT * FROM teams WHERE teamID = \'' + req.games.team2 + '\'';
        db.get(dbRequest, function(error, rows) {
            /* Add selected data to previous saved data. */
            req.team2 = rows;
            // console.log(req.team2)
            next();
        });
    }

  function overUnder(req, res, next) {
   
    const team1Avg = (req.team1.ptsFor + req.team2.ptsAgainst) / 2;
    const team2Avg = (req.team2.ptsFor + req.team1.ptsAgainst) / 2;
    const expScore = (team1Avg + team2Avg);
    
      const scoreHedge = 0.20
      let ouBet = "";
      let betAmt = "";
      let ouEdge =
        (Math.round(
          ((((expScore - req.games.ovUnd) / req.games.ovUnd) + ((1 / req.games.ovUndLine) - 0.54)) * 100
        ))) / 100
        console.log(ouEdge)
    
     const adjEdge = (ouEdge * scoreHedge)
    
      if (expScore >= req.games.ovUnd) {
        ouBet = "over"
        betAmount = adjEdge*bankRoll
        console.log(
          `${req.games.gameID} ${req.team1.teamID}  vs ${req.team2.teamID} Bet the over game as ${expScore} is higher than ${req.games.ovUnd}  you should bet $ ${adjEdge * bankRoll} based on current bankroll. edge = ${adjEdge}`
        );
        
      } else {
        ouBet = "under"
        betAmount = adjEdge*bankRoll
        console.log(
          `${req.games.gameID} ${req.team1.teamID} vs ${req.team2.teamID} Bet the under because ${expScore} is lower than ${req.games.ovUnd} you should bet $ ${adjEdge * bankRoll} based on current bankroll. ${adjEdge}`
        );
      }
      
    req.ouResults = { 
      expScore, 
      ouBet,
   betAmount,
    adjEdge ,
    }

      next()
    }


function renderBetsPage(req, res) {
  res.render("bets", { games: req.games, t1: req.team1, t2: req.team2, ouResults: req.ouResults   
  });
}

app.get('/games/bets/:id', getGames, findTeam1, findTeam2, overUnder, renderBetsPage);

