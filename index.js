const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var db = require('./data/db_config.js')
var dbUtils = require('./data/db_utils.js')
var cors = require('cors')

bankRoll = 1000

//Express Server Creation
const app = express();

// Server Congfiguration
app.set("view engine", "ejs");
app.set("views", [path.join(__dirname, "views"), path.join(__dirname, "views","gameviews"),path.join(__dirname, "views","teamviews")]);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())

///new stuff to make requestswork/
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Launch the server
app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});

//Enable Cross Origin Response.
app.use(cors())

// Create the games and teams tables.
dbUtils.createTeamsTable()
dbUtils.createGamesTable()
dbUtils.createOUBetsTable()
dbUtils.createMLBetsTable()
dbUtils.createPSBetsTable() 
 
const gamesRoute = require('./routes/games.js')
app.use('/games','gamesRoute')

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



// GET /create teams
app.get("/teams/create", (req, res) => {
  res.render("create", { model: {} });
});


// POST /create teams 
app.post("/teams/create", cors(), (req, res) => {
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




// GET /delete/5
app.get("/games/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM games WHERE (id = ?)";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("deletegames", { model: row });
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






// POST /games/create
app.post("/games/mlbets/create", (req, res) => {
  const sql = "INSERT OR IGNORE INTO OubBts (gameID,tournament,date,team1,team2,ovUnd,ovUndLine,draw,ccUUID,gender,ccIDteam1,ccIDteam2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const thing = [req.body.gameID, req.body.tournament, req.body.date, req.body.team1, req.body.team2, req.body.ovUnd,req.body.ovUndLine,req.body.draw,req.body.ccUUID,req.body.gender,req.body.ccIDteam1,req.body.ccIDteam2,req.body.ouBet,
  req.body.betAmount,req.body.adjEdge,req.body.scoreHedge ];
   db.run(sql,thing, err => {
     if (err) {
       return console.error(err.message);
     }
     res.redirect("/games");
   });
 });




