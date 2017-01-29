let assert = require('assert');

var fs = require('fs');
eval(fs.readFileSync('Morbid.js')+'');//fuck modules, build processes, webpack and shit. Good old include.Period.

describe("Morbid", function() {
	it("exists in a global namespace", () => {
		assert(M);
	});
});