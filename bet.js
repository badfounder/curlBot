// n

const { response } = require("express");

  
  
  // getPrint = ()=>{
  // fetch('http://localhost:3000/teams/api/')
  // .then((response) => response.json())
  // .then((data) => console.log(data.));  
  // }
  // getPrint()

  // const teamJoin = `SELECT *
// FROM games JOIN teams t1 ON games.team1 = t1.teamID 
// JOIN teams t2 games.team2 = t2.teamID  ;`


// joinCall = ()=>{
// db.all(teamJoin, [], (err, rows) => {
//   if (err) {
//     throw err;
//   }
//   rows.forEach((row) => {
//     console.log(row.team1SpreadOdds)
 
//   });
// });
// }

// joinCall()

// app.get("/teams/api", (req, res) => {
//   const sql = "SELECT * FROM teams ORDER BY teamID";
//   db.all(sql, [], (err, rows) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     res.send({rows});
//   });
// });
