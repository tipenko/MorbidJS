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

	it("returns length 2 if two elements added", () => {
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

	it("it is possible to add rule", () => {
		M.append('<div id=app class=blacklist1/>');
		M.rule('#app', {
			sound: () => {
				return true;
			}
		});
		expect(M('#app').sound()).to.be.ok();
	});

	it("all methods are exposed to top", () => {
		M.append('<div id=app class=blacklist1/>');
		M.append('<div id=manapp class=blacklist1/>');
		M.rule('#app', {
			sound: () => {
				return true;
			}
		});

		M.rule('#manapp', {
			escape: () => {
				return true;
			}
		});
		expect(M('div').sound).to.be.ok();
		expect(M('div').escape).to.be.ok();
	});

	it("you can call one method for whole collection, and some hard chain is returned", () => {
		M.append('<div id=app class=blacklist1/>');
		M.append('<div id=manapp class=blacklist1/>');

		M.rule('#app', {
			sound: () => {
				return true;
			}
		});

		M.rule('#manapp', {
			escape: () => {
				return true;
			}
		});
		expect(M('div').sound()).to.be.ok();//shall call warn
	});

	it("M returns report", () => {
		M.append('<div id=app class=blacklist1/>');
		M.append('<div id=manapp class=blacklist1/>');

		M.rule('#app', {
			sound: () => {
				return 'paramparamparam';
			}
		});

		M.rule('.blacklist1', {
			sound: () => {
				return true;
			}
		});

		var o = M('div').sound();
		expect(o.length).to.equal(2);
	});

	it("method for more specific selector is applied", () => {
		M.append('<div id=app class=blacklist1/>');
		M.append('<div id=manapp class=blacklist1/>');

		M.rule('#app', {
			sound: () => {
				return 'paramparamparam';
			}
		});

		M.rule('.blacklist1', {
			sound: () => {
				return true;
			}
		});

		var o = M('div').sound();
		expect(o[0].returnValue).to.equal('paramparamparam');
		expect(o[1].returnValue).to.equal(true);
	});


});