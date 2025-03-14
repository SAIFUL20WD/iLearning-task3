class ProbabilityCalculator {
	static calculateProbabilities(diceSets) {
		const numSets = diceSets.length;
		const probabilities = Array(numSets)
			.fill(null)
			.map(() => Array(numSets).fill(0));

		for (let i = 0; i < numSets; i++) {
			for (let j = 0; j < numSets; j++) {
				if (i === j) {
					probabilities[i][j] = "- (0.3333)";
				} else {
					let wins = 0,
						total = 0;
					for (let roll1 of diceSets[i]) {
						for (let roll2 of diceSets[j]) {
							if (roll1 > roll2) wins++;
							total++;
						}
					}
					probabilities[i][j] = (wins / total).toFixed(4);
				}
			}
		}

		return probabilities;
	}
}

module.exports = ProbabilityCalculator;
