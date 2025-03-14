const crypto = require("crypto");

class FairRandomGenerator {
	static generateRandomNumber(range) {
		return crypto.randomInt(0, range);
	}

	static generateKey() {
		return crypto.randomBytes(32).toString("hex");
	}
}

module.exports = FairRandomGenerator;
