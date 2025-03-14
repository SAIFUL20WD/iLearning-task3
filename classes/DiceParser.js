class DiceParser {
	static parseDiceSets(args) {
		return args.map((dice) => dice.split(",").map(Number));
	}

	static verifyDiceFormat(diceSets, expectedLength = 6) {
		return diceSets.every(
			(row) =>
				Array.isArray(row) &&
				row.length === expectedLength &&
				row.every((element) => typeof element === "number" && !Number.isNaN(element))
		);
	}
}

module.exports = DiceParser;
