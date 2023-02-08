const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
const db_name = path.join(__dirname,"apptest.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connection is estabilised to 'apptest.db'");
}); //brings in data base mgmt module
const dbUtils = require("./data/db_utils.js") //diferent data base functions as methods

const bankRoll = 1000

//Express Server Creation
const app = express();

// Server Congfiguration
app.set("view engine", "ejs");
app.set("views", [path.join(__dirname, "views"), path.join(__dirname, "views","gameviews"),path.join(__dirname, "views","teamviews")]);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }))

// Launch the server
app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});


// dbUtils.ctt 


// dbUtils.cgt //Creates a second table for games and seeds its with data.
 
 
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
        
    
     const adjEdge = (Math.round((ouEdge * scoreHedge)*100)/100)
    
      if (expScore >= req.games.ovUnd) {
        ouBet = "over"
        betAmount = adjEdge*bankRoll
        // console.log(
        //   `${req.games.gameID} ${req.team1.teamID}  vs ${req.team2.teamID} Bet the over game as ${expScore} is higher than ${req.games.ovUnd}  you should bet $ ${adjEdge * bankRoll} based on current bankroll. edge = ${adjEdge}`
        // );
        
      } else {
        ouBet = "under"
        betAmount = adjEdge*bankRoll
        // console.log(
        //   `${req.games.gameID} ${req.team1.teamID} vs ${req.team2.teamID} Bet the under because ${expScore} is lower than ${req.games.ovUnd} you should bet $ ${adjEdge * bankRoll} based on current bankroll. ${adjEdge}`
        // );
      }
      
  req.ouResults = { 
  expScore, 
  ouBet,
  betAmount,
  adjEdge ,
    }

      next()
    }

    function moneyLineEval(req, res, next){

      let lookAtWinPer = req.team1.winPer - req.team2.winPer;
      let lookAtNetScore = req.team1.netScore - req.team2.netScore;
      let lookAtNetEff = req.team1.netEff - req.team2.netEff
      let team1ImpPer = Math.round(((1/req.games.team1StraightOdds)-.04)*100)/100 ;
      let favouriteFinder = (req) => {
     
        if(req.games.team2StraightOdds - req.games.team1StraightOdds > 0){
          return req.team1.teamID
        } 
        else {
          return req.team2.teamID
      }
    };
    
    function getWinProb(){
      const yInt = 0.4811
      const cwinPer = 0.9843
      const cnetScore = -0.0324
      const cnetEff = 0.9823  
      
      return Math.round((yInt + (cwinPer*lookAtWinPer) + (cnetScore*lookAtNetScore) + (cnetEff*lookAtNetEff))*100)/100;
    }

    let estWinProb = getWinProb();
    let mlEdge = estWinProb - team1ImpPer

    let favourite= favouriteFinder(req)
      // console.log(`${req.games.gameID} MoneyLine ${req.team1.teamId} : is ${favourite} , with, ${team1ImpPer}% ,chance to win.,  Net Win Per, ${lookAtWinPer} , Net Score, ${lookAtNetScore}, Net Efficiency, ${lookAtNetEff}`)
      
      req.mlResults = { 
        lookAtWinPer,
        lookAtNetScore,
        lookAtNetEff,
        team1ImpPer,
        favourite,
        estWinProb,
        mlEdge 
      }

next()

      };

      function spreadEval(req, res, next) {
        const spreadDescrepancy = .75 //This is a threshold for when to bet on moneyline mispricing 1=1point
        let t1expNetScore = (Math.round((req.team1.netScore - req.team2.netScore )*100)/100);
        let t2expNetScore = (Math.round((req.team2.netScore - req.team1.netScore )*100)/100);
        let team1ptsSprd = (-1 * req.games.ptsSprd)
        let team2ptsSprd = req.games.ptsSprd;
        let team1sprdPer =  (Math.round(req.games.team2SpreadOdds / (req.games.team1SpreadOdds + req.games.team2SpreadOdds)*100)/100);
        let team2sprdPer =  (Math.round(req.games.team1SpreadOdds / (req.games.team1SpreadOdds + req.games.team2SpreadOdds)*100)/100);
        let sprdBet = "";

      //  console.log(`${req.games.gameID}: ${req.team1.teamID} expected netscore ${t1expNetScore} vs points spread of ${team1ptsSprd}`)
      
       if (team1ptsSprd - t1expNetScore > spreadDescrepancy){
      sprdBet = "team2"
      }
      
      
      else if (team2ptsSprd - t2expNetScore > spreadDescrepancy) {
      
      sprdBet = "team1"
      }
      
      else {
      sprdBet = "no bet"
      };
  
      req.sprdResults = { 
        t1expNetScore,
        t2expNetScore,
        team1ptsSprd,
        team2ptsSprd,
        team2sprdPer,
        team1sprdPer,
        sprdBet 
      }

next()
  
};

  
  function renderBetsPage(req, res) {
  res.render("bets", { games: req.games, t1: req.team1, t2: req.team2, ouResults: req.ouResults, mlResults: req.mlResults, sprdResults: req.sprdResults   
  });
}


app.get('/games/bets/:id', getGames, findTeam1, findTeam2, overUnder, moneyLineEval, spreadEval, renderBetsPage);
