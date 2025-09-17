
/*
 Adventure Game
Este es un juego de aventura basado en texto donde el jugador puede tomar desiciones.
*/
const readline = require("readline-sync");
// Create variables for player stats
let playerHealth = 100;
let playerGold = 20;
let currentLocation = "Village";
let inventory = [];
let gameRunning = true;

//Get player name using readline-sync
const playerName = readline.question("Enter your name, adventurer: ");
// Display the game title
console.log("Welcome to the Adventure Game!");

// Add a welcome message
console.log("Prepare yourself for an epic journey!");

// Display welcome message and starting stats to the player
console.log(`Welcome, ${playerName}! You start your journey in the ${currentLocation}.`);
console.log(`Health: ${playerHealth}, Gold: ${playerGold}`);