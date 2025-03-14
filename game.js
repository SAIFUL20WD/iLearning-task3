const DiceParser = require("./classes/DiceParser");
const GameEngine = require("./classes/GameEngine");

const args = process.argv.slice(2);
const diceSets = DiceParser.parseDiceSets(args);
const isValid = DiceParser.verifyDiceFormat(diceSets);

if (diceSets.length < 3 || !isValid) {
	console.log(
		"You must provide at least three or more dice sets each containing six integer value. \nExample: 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3"
	);
	process.exit(1);
}

let game = new GameEngine(diceSets);
game.startGame();
