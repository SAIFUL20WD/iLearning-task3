const crypto = require("crypto");
const FairRandomGenerator = require("./FairRandomGenerator");

class HMACGenerator {
	constructor() {
		this.key = FairRandomGenerator.generateKey();
	}

	generateHMAC(value) {
		return crypto.createHmac("sha3-256", this.key).update(value.toString()).digest("hex");
	}

	revealKey() {
		return this.key;
	}
}

module.exports = HMACGenerator;
