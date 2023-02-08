


// async function  getTeams(){
// te
//   .then((response) => response.json())
//   .then((data) => { 

//     const sql = "INSERT OR IGNORE INTO teams (teamID,ccID) VALUES (?,?)";
//     const insert = [data.name, data.id];
//   }    
//    .then(data)={} for (const team of data)
  

    
   
//   });
//   })
// }

async function getTeams () {
fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/teams')
const response = await fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/teams')
const teams = await response.json();
return teams;
};

getTeams().then(teams =>{ 
  for (const team of teams) 
  console.log(team.id,team.name)

  })

//   const gameData = 
// fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/games')
//   .then((response) => response.json())
//   .then((data) => { 
//    let games = []
//     for (const game of data)
//     console.log(`${game.name},${game.draw.label},${game.id},${game.draw.starts_at},${game.game_positions[0].competition_team_id},${game.game_positions[1].competition_team_id}`)
//   });


  