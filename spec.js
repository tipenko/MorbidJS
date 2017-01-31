describe("Morbid first batch", function() {
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

	it("more complex case of specificity", () => {
		M.append('<div id=app class=blacklist1/>');
		M.append('<div id=manapp class=blacklist1/>');

		M.rule('#app', {
			sound: () => {
				return 'paramparamparam';
			}, 
			mute: () => {
				return 'mute';
			}
		});

		M.rule('.blacklist1', {
			sound: () => {
				return true;
			}
		});

		M.rule('#app.blacklist1', {
			sound: () => {
				return "app";
			}
		});

		var s = M('#app').sound();
		var m = M('#app').mute();

		expect(s[0].returnValue).to.equal('app');
		expect(m[0].returnValue).to.equal('mute');

	});
});

describe("Morbid second batch, DOM-related", function() {
	beforeEach(()=>{
		M.purge();
		$('body').append('<div id=MorbidBase/>');
		$('#MorbidBase').html(`
			<div id="host">
				<span class="child1"/>
				<span class="child2"/>
			</div>

		`).hide();
	});

	afterEach(()=>{
		$('#MorbidBase').remove();
	});

	it("Morbid manages pre-existing DOM", () => {
		M.control(document.getElementById('MorbidBase'));
		expect(M('#host')[0].children.length).to.equal(2);
	});

	it("Morbid applies behaviours to pre-existing DOM ", () => {
		M.control(document.getElementById('MorbidBase'));

		M.rule('.child1', {
			test : () => {
				return true;
			}
		});
		var r = M('.child1').test();
		expect(r.length).to.equal(1);
		expect(r[0].returnValue).to.equal(true);
	});

	it("Morbid sole returns result instead of execution report ", () => {
		M.control(document.getElementById('MorbidBase'));

		M.rule('.child1', {
			test : () => {
				return true;
			}
		});
		debugger;
		var r = M('.child1').sole.test();
		expect(r).to.equal(true);
	});

	it("Invocation of nonexistent method does not results in exception", () => {
		M.control(document.getElementById('MorbidBase'));

		M.rule('.child1', {
			test : () => {
				return true;
			}
		});
		var fine = undefined;
		try {
			M('.child1').explode();
			fine = true;
		} catch(e){
			fine = false;
		}
		expect(fine).to.equal(true);
	});

	it("one can assign onclick listener via rule ", () => {
		M.control(document.getElementById('MorbidBase'));

		var itHasChanged = false;
		M.rule('.child1', {
			click : () => {
				itHasChanged = true;
				return true;
			}
		});

		$('.child1').trigger('click');
		expect(itHasChanged).to.be.ok();
	});

	it("event listener receives event as param", () => {
		M.control(document.getElementById('MorbidBase'));

		M.rule('.child1', {
			click : (event) => {
				expect(event.type).to.be.equal('click');
			}
		});

		$('.child1').trigger('click');
	});
});


