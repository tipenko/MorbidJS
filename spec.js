let assert = require('assert');

var fs = require('fs');
eval(fs.readFileSync('Morbid.js')+'');//fuck modules, build processes, webpack and shit. Good old include.Period.

describe("Morbid", function() {

	beforeEach(()=>{
		M.purge();
	});

	it("exists in a global namespace", () => {
		assert(M);
	});

	it("has add method", () => {
		assert(M.add('div','app','blacklist1'));
	});

	it("returns all added if queried this way", () => {
		M.add('div','app','blacklist1');
		M.add('div','app','blacklist2');
		assert.equal(M('div').length, 2);
	});
});