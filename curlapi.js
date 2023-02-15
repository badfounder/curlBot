//This manages pulls from Curling Canada Website.

const url = "https://legacy-curlingio.global.ssl.fastly.net/api/organizations/"; ///this is the core curling canada URL
const org = "qw4LUsJ1_aQ/"; // This is a unique org ID; 'qw4LUsJ1_aQ/' is Curling Canada ORG ID  & LgN7sn6ydNI/ is GSOC ORD ID
const compID = "competitions/8079/"; /// This is the ID of the tournament.
let compURL = url + org + compID; //core URI for requests/
const teamEP = "teams"; //Teams endpoint
const gamesEP = "games"; //Games endpoint
const gender = "women"; /// This is just text, for whatever reason not in an API.

let tournamentName = ""; //

async function getTournament() {
  const response = await fetch(url + org + compID);
  const name = await response.json();
  return name;
}

getTournament().then((tournament) => {
  tournamentName = tournament.title;
  console.log(tournamentName);
});

// This function grabs the teams fromc curling canada and then uses my post route to update them.

async function getTeams() {
  const response = await fetch(compURL + teamEP);
  const teams = await response.json();
  return teams;
}

//This funciton grabs all the games.
async function getGames() {
  const response = await fetch(compURL + gamesEP);
  const games = await response.json();
  return games;
}

// This calls curling canada based on unique game ID, then takes the two team ids and calls another endpoint to get their descriptive names.
async function updateTeamNames(gameID) {
  fetch(compURL + gamesEP + "/" + gameID)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(async function (data) {
      // Store the post data to a variable
      game = data;

      // Fetch another API
      let teams = Promise.all([
        fetch(
          compURL + teamEP + "/" + game.game_positions[0].competition_team_id
        ).then((response) => response.json()),
        fetch(
          compURL + teamEP + "/" + +game.game_positions[1].competition_team_id
        ).then((response) => response.json()),
      ]);
      return teams;
    })
    .then((teams) => {
      // console.log(teams)

      fetch("http://localhost:3000/games/edit/api/" + gameID, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ team1: teams[0].name, team2: teams[1].name }),
      });
    })
    .catch(function (error) {
      console.warn(error);
    });
}

// This gets all of the games in a given tournament and posts them to my DB
getGames().then((games) => {
  for (const game of games)
    fetch("http://localhost:3000/games/create", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        date: game.draw.starts_at,
        ccUUID: game.id,
        gameID: game.name,
        ccIDteam1: game.game_positions[0].competition_team_id,
        ccIDteam2: game.game_positions[1].competition_team_id,
        tournament: tournamentName,
        gender: gender,
        draw: game.draw.label,
      }),
    });
});

// This gets all the teams from CC for a given tournament and then posts them to my database.

getTeams().then((teams) => {
  for (const team of teams)
    fetch("http://localhost:3000/teams/create", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        teamID: team.name,
        ccID: team.id,
        gender: gender,
      }),
    });
});

/// This gets all of the UUID games for the tournament and then adds then calls the update team names funciton. (the get teams call only returns ids on that endpoint, this add is decriptive names.)

getGames().then((games) => {
  for (const game of games) updateTeamNames(game.id);
});

// this gets all the game in the tournament and then updates the scores and who won or lost.
getGames().then((games) => {
  for (const game of games)
    fetch("http://localhost:3000/games/score/" + game.id, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        team1score: game.game_positions[0].total,
        team2score: game.game_positions[1].total,
        team1result: game.game_positions[0].total,
        team2result: game.game_positions[1].total,
      }),
    });
});
