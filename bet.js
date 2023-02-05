function overUnder(req,res,next) {
  const part1 = (req.team1.ptsFor + req.team2.ptsAgainst) / 2;
  const part2 = (req.team2.ptsFor + req.team1.ptsAgainst) / 2;
  const expScore = (part1 + part2);
  const scoreHedge = 0.20
  const ouBet = "";
  const betAmt = "";
  const ouEdge =
    (Math.round(
      ((((expScore - req.game.ovUnd) / req.game.ovUnd) + ((1 / req.game.ovUndLine) - 0.54)) * 100
    ))) / 100

 const adjEdge = (ouEdge * scoreHedge)

  if (expScore >= game.ovUnd) {
    ouBet = "over"
    betAmount = adjEdge*bankRoll
    console.log(
      `${req.game.gameId} ${req.team1.teamId}  vs ${req.team2.teamId} Bet the over game as ${expScore} is higher than ${game.ovUnd}  you should bet $ ${adjEdge * bankRoll} based on current bankroll. edge = ${adjEdge}`
    );
    
  } else {
    ouBet = "under"
    betAmount = adjEdge*bankRoll
    console.log(
      `${req.game.gameId} ${req.game.team1.teamId} vs ${req.team2.teamId} Bet the under because ${expScore} is lower than ${req.ovUnd} you should bet $ ${adjEdge * bankRoll} based on current bankroll. ${adjEdge}`
    );
  }
  next()
}

function lineEval(game) {
  const lineDescrepancy = .75 //This is a threshold for when to det on moneyline mispricing 1=1point
  const part1 = (game.team1.ptsFor + game.team2.ptsAgainst) / 2;
  const part2 = (game.team2.ptsFor + game.team1.ptsAgainst) / 2;
  const expScore = (part1 + part2)
  const t1expNetScore = (Math.round((game.team1.netScore - game.team2.netScore )*100)/100);
  const t2expNetScore = (Math.round((game.team2.netScore - game.team1.netScore )*100)/100);
  team1ptsSprd = (-1 * game.ptsSprd)
  team2ptsSprd = game.ptsSprd;
  const team1linePer =   Math.round(game.team2LineOdds / (game.team1LineOdds + game.team2LineOdds)*100)/100;
  const team2linePer =  Math.round(game.team1LineOdds / (game.team1LineOdds +game.team2LineOdds)*100)/100;

 console.log(`${game.gameId}: ${game.team1.teamId} expected netscore ${t1expNetScore} vs points spread of ${team1ptsSprd}`)
if (team1ptsSprd - t1expNetScore > lineDescrepancy){
  console.log(`Take ${game.team2.teamId}, priced at ${team1linePer}` )
}

else if (team2ptsSprd - t2expNetScore > lineDescrepancy) {

  console.log(`Take ${game.team1.teamId} with the line ${team2linePer}`)
}

else {
  console.log(`The Pointspread gap is not big enough/not out of line`  )
}

console.log(team1linePer)
console.log(team2linePer)

}

function moneyLineEval(game){

const lookAtWinPer = Math.round((game.team1.winPer - game.team2.winPer)*100)/100;
const lookAtNetScore = Math.round((game.team1.netScore - game.team2.netScore)*100)/100;
const lookAtNetEff = Math.round((game.team1.netEff - game.team2.netEff)*100)/100;
const team1ImpPer = Math.round(((1/game.team1StraightOdds)-.04)*100)/100 ;
function isFavourite(game){
  if((game.team2StraightOdds - game.team1StraightOdds) > 0){
    return "The Favourite"
  } 
  else {
    return "Not The Favourite"
};
}
console.log(`${game.gameId} MoneyLine ${game.team1.teamId} : is ${isFavourite(game)} , with, ${team1ImpPer}% ,chance to win.,  Net Win Per, ${lookAtWinPer} , Net Score, ${lookAtNetScore}, Net Efficiency, ${lookAtNetEff}`)

};

module.exports = { overUnder };