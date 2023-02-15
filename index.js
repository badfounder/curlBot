const express = require("express");
const path = require("path");
// const sqlite3 = require("sqlite3").verbose();
var bodyParser = require("body-parser");
const { json } = require("body-parser");
var db = require("./data/db_config.js");
var dbUtils = require("./data/db_utils.js");
var cors = require("cors");

//Express Server Creation
const app = express();

// Server Congfiguration
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views", "gameviews"),
  path.join(__dirname, "views", "teamviews"),
  path.join(__dirname, "views", "betsviews"),
]);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

///new stuff to make requestswork/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Launch the server
app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});

//Enable Cross Origin Response.
app.use(cors());

//this connects the diffent routes to the index file and efines top level URI for them.
const gamesRoute = require("./routes/games.js");
const teamsRoute = require("./routes/teams.js");
const betsRoute = require("./routes/bets.js");

// The Four Defined Top Level Routes.
app.use("/games", gamesRoute);
app.use("/teams", teamsRoute);
app.use("/bets", betsRoute);
app.get("/", (req, res) => {
  res.render("index");
});

// Create the relevant tables.
dbUtils.createTeamsTable();
dbUtils.createGamesTable();
dbUtils.createOUBetsTable();
dbUtils.createMLBetsTable();
dbUtils.createPSBetsTable();
