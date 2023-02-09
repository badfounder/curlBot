const url = 'https://legacy-curlingio.global.ssl.fastly.net/api/organizations/'
const org = 'qw4LUsJ1_aQ/'
const compID = '8079'
const gender = "women"

const tournament = "STOH23"
// async function getTournament (){
// const response = await fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079')
// const name = await response.json();
// return name;
// tournament = name
// };

// getTournament().then(console.log(tournament))

// This function grabs the teams fromc curling canada and then uses my post route to update them.

async function getTeams () {
// fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/teams')
const response = await fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/teams')
const teams = await response.json();
return teams;
};

getTeams().then(teams =>{ 
  for (const team of teams) 
  fetch('http://localhost:3000/teams/create',{method:'POST',mode: 'cors', headers: {'Content-Type': 'application/json', 'Accept': 'application/json',}, body: JSON.stringify({teamID:team.name,ccID:team.id,gender:gender})
  })
})

//This funciton grabs the games from 
async function getGames () {
const response = await fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/games')
const games = await response.json()    
return games;
}

getGames().then( games => {
  for (const game of games)
  fetch('http://localhost:3000/games/create',{method:'POST',mode: 'cors', headers: {'Content-Type': 'application/json', 'Accept': 'application/json',}, 
  body: JSON.stringify({date:game.draw.starts_at,ccUUID:game.id,gameID:game.name,ccIDteam1:game.game_positions[0].competition_team_id,ccIDteam2:game.game_positions[1].competition_team_id,tournament:tournament,gender:gender,draw:game.draw.label})
}
) 
})

