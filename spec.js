describe("Morbid", function() {
	beforeEach(()=>{
		M.purge();
	});

	it("exists in a global namespace", () => {
		expect(M).to.be.ok();
	});

	it("has add method", () => {
		expect(M.add('div','app','blacklist1')).to.be.ok();
	});

	it("returns all added if queried this way", () => {
		M.add('div','app','blacklist1');
		M.add('div','app','blacklist2');
		expect(M('div').length).to.be.equal(2);
	});
});