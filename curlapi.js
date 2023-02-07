
const teamData = 
fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/teams')
  .then((response) => response.json())
  .then((data) => { 
   let teams = []
    for (const team of data)
    teams.push(team.short_name)
    console.log(teams)
   
  });

 

  const gameData = 
fetch('https://legacy-curlingio.global.ssl.fastly.net/api/organizations/qw4LUsJ1_aQ/competitions/8079/games')
  .then((response) => response.json())
  .then((data) => { 
   let games = []
    for (const game of data)
    console.log(`${game.name},${game.draw.label},${game.id},${game.draw.starts_at}`)
  });


  