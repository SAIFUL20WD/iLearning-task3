const readlineSync = require("readline-sync");
const FairRandomGenerator = require("./FairRandomGenerator");
const HMACGenerator = require("./HMACGenerator");
const DiceSet = require("./DiceSet");
const TableGenerator = require("./TableGenerator");

class GameEngine {
	constructor(diceSets) {
		this.diceSets = diceSets.map((set) => new DiceSet(set));
		this.computerDiceSetIndex = null;
		this.userDiceSetindex = null;
		this.computerChoosenDiceValue = null;
		this.userChoosenDiceValue = null;
	}

	takeUserInput(question) {
		return readlineSync.question(question).trim();
	}

	selectDiceSet(computerFirst) {
		const availableChoices = this.diceSets.length;

		if (computerFirst) {
			this.computerDiceSetIndex = FairRandomGenerator.generateRandomNumber(availableChoices - 1);
			console.log(`I choose the [${this.diceSets[this.computerDiceSetIndex].dice}] dice.`);
		}

		while (true) {
			console.log("Choose your dice:");
			for (let i = 0; i < availableChoices; i++) {
				if (computerFirst && this.computerDiceSetIndex === i) {
					continue;
				}
				console.log(`${i} - ${this.diceSets[i].dice.map((faces) => faces)}`);
			}
			console.log("X - exit");
			console.log("? - help");

			const userSelection = this.takeUserInput("Your selection: ");
			if (userSelection.toUpperCase() === "X") {
				console.log("Exiting the game...");
				process.exit(0);
			}

			if (userSelection === "?") {
				TableGenerator.displayProbabilityTable(this.diceSets.map((ds) => ds.dice.map((faces) => faces)));
				continue;
			}

			this.userDiceSetindex = parseInt(userSelection);
			if (
				this.userDiceSetindex >= 0 &&
				this.userDiceSetindex < availableChoices &&
				this.userDiceSetindex !== this.computerDiceSetIndex
			) {
				console.log(`You choose the [${this.diceSets[this.userDiceSetindex].dice}] dice.`);
				this.computerDiceSetIndex = FairRandomGenerator.generateRandomNumber(availableChoices - 1);
				while (this.computerDiceSetIndex === this.userDiceSetindex) {
					this.computerDiceSetIndex = FairRandomGenerator.generateRandomNumber(availableChoices - 1);
				}
				computerFirst === false
					? console.log(`I choose the [${this.diceSets[this.computerDiceSetIndex].dice}] dice.`)
					: "";
				break;
			}

			console.log("Invalid choice! Please enter a valid dice set index.");
		}
	}

	rollDice(thrower) {
		console.log(`It's time for ${thrower === "user" ? "your" : "my"} throw!`);
		const computerSelection = FairRandomGenerator.generateRandomNumber(6);
		let hmacGen = new HMACGenerator();
		let hmac = hmacGen.generateHMAC(computerSelection);

		console.log(`I selected a random value in the range 0..5 \n(HMAC=${hmac}).`);
		console.log("Add your number modulo 6.");

		for (let i = 0; i < this.diceSets[0].dice.length; i++) {
			console.log(`${i} - ${i}`);
		}
		console.log("X - exit");
		console.log("? - help");

		let userSelection = this.takeUserInput("Your Selection: ");

		if (userSelection.toUpperCase() === "X") {
			console.log("Exiting the game...");
			process.exit(0);
		}

		if (userSelection === "?") {
			TableGenerator.displayProbabilityTable(this.diceSets.map((ds) => ds.dice.map((faces) => faces)));
		}

		while (!["0", "1", "2", "3", "4", "5"].includes(userSelection)) {
			userSelection = this.takeUserInput("Invalid input. Choose between 0-5: ");
		}

		console.log(`My number is ${computerSelection} (KEY=${hmacGen.revealKey()}).`);

		const diceIndex = (computerSelection + parseInt(userSelection)) % 6;
		console.log(`The result is ${computerSelection} + ${userSelection} = ${diceIndex} (mod 6)`);

		if (thrower === "user") {
			this.userChoosenDiceValue = this.diceSets[this.userDiceSetindex].dice[diceIndex];
			console.log(`Your throw is: ${this.userChoosenDiceValue}`);
		} else {
			this.computerChoosenDiceValue = this.diceSets[this.computerDiceSetIndex].dice[diceIndex];
			console.log(`My throw is: ${this.computerChoosenDiceValue}`);
		}
	}

	startGame() {
		console.log("Let's determine who makes the first move.");
		const computerValue = FairRandomGenerator.generateRandomNumber(2);
		const hmacGen = new HMACGenerator();
		const hmac = hmacGen.generateHMAC(computerValue);

		console.log(`I selected a random value in the range 0..1 \n(HMAC=${hmac}).`);

		let userGuess;

		while (true) {
			console.log("Try to guess my selection.");
			console.log("0 - 0");
			console.log("1 - 1");
			console.log("X - exit");
			console.log("? - help");

			userGuess = this.takeUserInput("Your Selection: ");

			if (userGuess.toUpperCase() === "X") {
				console.log("Exiting the game...");
				process.exit(0);
			}

			if (userGuess === "?") {
				TableGenerator.displayProbabilityTable(this.diceSets.map((ds) => ds.dice.map((faces) => faces)));
				continue;
			}

			if (userGuess === "0" || userGuess === "1") {
				userGuess = parseInt(userGuess);
				console.log(`My selection: ${computerValue} (KEY=${hmacGen.revealKey()}).`);
				break;
			}

			console.log("Invalid input! Please enter 0, 1, ?, or X.");
		}

		let computerFirst = userGuess !== computerValue;
		console.log(`${computerFirst ? "I" : "You"} make the first move and choose a dice set first.`);

		this.selectDiceSet(computerFirst);

		this.rollDice("computer");
		this.rollDice("user");

		console.log("Determining the winner...");
		if (this.computerChoosenDiceValue > this.userChoosenDiceValue) {
			console.log(`Computer win (${this.computerChoosenDiceValue} > ${this.userChoosenDiceValue})!`);
		} else if (this.computerChoosenDiceValue < this.userChoosenDiceValue) {
			console.log(`You win (${this.userChoosenDiceValue} > ${this.computerChoosenDiceValue})!`);
		} else {
			console.log("It's a draw!");
		}
	}
}

module.exports = GameEngine;
