const { table } = require("table");
const ProbabilityCalculator = require("./ProbabilityCalculator");

class TableGenerator {
	static displayProbabilityTable(diceSets) {
		const probabilities = ProbabilityCalculator.calculateProbabilities(diceSets);
		const headers = ["User dice v", ...diceSets.map((value) => value)];
		const tableData = [headers];

		diceSets.forEach((value, i) => {
			tableData.push([value, ...probabilities[i]]);
		});

		console.log("Probability of winning:");
		console.log(table(tableData));
	}
}

module.exports = TableGenerator;
