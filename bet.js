// n

const { response } = require("express");

  
  
  getPrint = ()=>{
  fetch('http://localhost:3000/teams/api/')
  .then((response) => response.json())
  .then((data) => console.log(data.));  
  }

  getPrint()

