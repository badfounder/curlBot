var db = require('./data/db_config.js')


var game  = ""; 
var team = "";

async function getChannelFromID(db, id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM '${id}'`,(err, row) => {
            if (err) reject(err); // I assume this is how an error is thrown with your db callback
            resolve(row.channel);
        });
    });
}




function getGames(gameID) {
    var dbRequest = 'SELECT * FROM games WHERE id = ?'
    var param = gameID;
    db.get(dbRequest,param, function(error, rows) {
        if(rows.length !== 0) {
           return rows;

        }  console.log(rows)
  
    });
  }

  function findTeam1(game) {
    dbRequest = 'SELECT * FROM teams WHERE teamID = \'' + game.team1.teamID + '\'';
        db.get(dbRequest, function(error, rows) {
            /* Add selected data to previous saved data. */
            game.team1 = rows;
            // console.log(req.team1)
            
        });
    }
  
    function findTeam2(game) {
      dbRequest = 'SELECT * FROM teams WHERE teamID = \'' + game.team2.teamID + '\'';
          db.get(dbRequest, function(error, rows) {
              /* Add selected data to previous saved data. */
              game.team2 = rows;
              // console.log(req.team2)
             
          });
      }

//       function overUnder(game) {
   
//         const team1Avg = (req.team1.ptsFor + req.team2.ptsAgainst) / 2;
//         const team2Avg = (req.team2.ptsFor + req.team1.ptsAgainst) / 2;
//         const expScore = (team1Avg + team2Avg);
        
//           const scoreHedge = 0.20
//           let ouBet = "";
//           let betAmt = "";
//           let ouEdge =
//             (Math.round(
//               ((((expScore - req.games.ovUnd) / req.games.ovUnd) + ((1 / req.games.ovUndLine) - 0.54)) * 100
//             ))) / 100
            
        
//          const adjEdge = (Math.round((ouEdge * scoreHedge)*100)/100)
        
//           if (expScore >= req.games.ovUnd) {
//             ouBet = "over"
//             betAmount = adjEdge*bankRoll
//             // console.log(
//             //   `${req.games.gameID} ${req.team1.teamID}  vs ${req.team2.teamID} Bet the over game as ${expScore} is higher than ${req.games.ovUnd}  you should bet $ ${adjEdge * bankRoll} based on current bankroll. edge = ${adjEdge}`
//             // );
            
//           } else {
//             ouBet = "under"
//             betAmount = adjEdge*bankRoll
//             // console.log(
//             //   `${req.games.gameID} ${req.team1.teamID} vs ${req.team2.teamID} Bet the under because ${expScore} is lower than ${req.games.ovUnd} you should bet $ ${adjEdge * bankRoll} based on current bankroll. ${adjEdge}`
//             // );
//           }
          
//     //   req.ouResults = { 
//     //   expScore, 
//     //   ouBet,
//     //   betAmount,
//     //   adjEdge ,
//     //   scoreHedge,
    
//     // }
// }
// function fillOuTable(game){
//     app.post("/games/mlbets/create", (req, res) => {
//           const sql = "INSERT OR IGNORE INTO OubBets (gameID,tournament,date,team1,team2,ovUnd,ovUndLine,draw,ccUUID,gender,ccIDteam1,ccIDteam2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//           const thing = [req.body.gameID, req.body.tournament, req.body.date, req.body.team1, req.body.team2, req.body.ovUnd,req.body.ovUndLine,req.body.draw,
//             req.body.ccUUID,req.body.gender,req.body.ccIDteam1,req.body.ccIDteam2,req.body.ouBet, req.body.betAmount,req.body.adjEdge,req.body.scoreHedge ];
//            db.run(sql,thing, err => {
//              if (err) {
//                return console.error(err.message);
//              }
//              res.redirect("/games");
//            });
//          });
//     }
    
  



