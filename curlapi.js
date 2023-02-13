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

// async function getTeamNames(games){
// for (const game of games)
//   teamname = await fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/${game.id}');
//   console.log(teamname)
// }

getGames().then( games => {
  for (const game of games)
  fetch('http://localhost:3000/games/create',{method:'POST',mode: 'cors', headers: {'Content-Type': 'application/json', 'Accept': 'application/json',}, 
  body: JSON.stringify({date:game.draw.starts_at,ccUUID:game.id,gameID:game.name,ccIDteam1:game.game_positions[0].competition_team_id,ccIDteam2:game.game_positions[1].competition_team_id,tournament:tournament,gender:gender,draw:game.draw.label})
}
) 
})


async function updateTeamNames(gameID){

fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/games/'+gameID).then(function (response) {
	if (response.ok) {
		return response.json();
	} else {
		return Promise.reject(response);
	}
}).then(async function (data) {

	// Store the post data to a variable
	game = data

	// Fetch another API
let teams =	Promise.all([
		fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/teams/' + game.game_positions[0].competition_team_id).then(response => response.json()),
		fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/teams/' + game.game_positions[1].competition_team_id).then(response => response.json()),
	]);
return teams;

}).then( (teams)=> {
console.log(teams)

	fetch('http://localhost:3000/games/edit/api/'+gameID,{method:'PUT',mode: 'cors', headers: {'Content-Type': 'application/json', 'Accept': 'application/json',}, 
body: JSON.stringify({team1:teams[0].short_name , team2:teams[1].short_name})
})
}).catch(function (error) {
	console.warn(error);})
;
}

// updateTeamNames('df107ffa-9511-450b-963a-7d93edc44079')

getGames().then(games => {
	for (const game of games)
	updateTeamNames(game.id)

});

