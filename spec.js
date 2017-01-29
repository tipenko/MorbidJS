describe("Morbid", function() {
	beforeEach(()=>{
		M.purge();
	});

	it("exists in a global namespace", () => {
		expect(M).to.be.ok();
	});

	it("has append method", () => {
		expect(M.append('<div id=app class=blacklist1/>')).to.be.ok();
	});

	it("returns all appended if queried this way", () => {
		M.append('<div id=app class=blacklist1/>');
		M.append('<div id=app class=blacklist2/>')
		expect(M('div').length).to.be.equal(2);
	});

	it("returns plain for nested ", () => {
		M.append('<div id=app class=blacklist1/>');
		M.append('.blacklist1', '<div id=app4 class=blacklist2/>');
		M.append('<div id=app2 class=blacklist3/>');

		expect(M('div').length).to.equal(3);
	});
		
	it("allows nested construction", () => {
		M.append('<div id=app class=blacklist1/>');
		M.append('.blacklist1', '<div id=app class=blacklist2/>')
		expect(M('.blacklist1').children().length).to.equal(1);
	});

});