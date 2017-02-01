describe("Morbid first batch", function() {
	beforeEach(()=>{
		M.purge();
	});

	it("exists in a global namespace", () => {
		expect(M).to.be.ok();
	});

	it("has eke method", () => {
		expect(M.eke('<div id=app class=blacklist1/>')).to.be.ok();
	});

	it("returns length 2 if two elements added", () => {
		M.eke('<div id=app class=blacklist1/>');
		M.eke('<div id=app class=blacklist2/>');
		expect(M('div').length).to.be.equal(2);
	});

	it("returns plain for nested ", () => {
		M.eke('<div id=app class=blacklist1/>');
		M.eke('.blacklist1', '<div id=app4 class=blacklist2/>');
		M.eke('<div id=app2 class=blacklist3/>');

		expect(M('div').length).to.equal(3);
	});
		
	it("allows nested construction", () => {
		M.eke('<div id=app class=blacklist1/>');
		M.eke('.blacklist1', '<div id=app class=blacklist2/>')
		expect(M('.blacklist1').children().length).to.equal(1);
	});

	it("it is possible to add rule", () => {
		M.eke('<div id=app class=blacklist1/>');
		M.lute('#app', {
			sound: () => {
				return true;
			}
		});
		expect(M('#app').sound()).to.be.ok();
	});

	it("all methods are exposed to top", () => {
		M.eke('<div id=app class=blacklist1/>');
		M.eke('<div id=manapp class=blacklist1/>');
		M.lute('#app', {
			sound: () => {
				return true;
			}
		});

		M.lute('#manapp', {
			escape: () => {
				return true;
			}
		});
		expect(M('div').sound).to.be.ok();
		expect(M('div').escape).to.be.ok();
	});

	it("you can call one method for whole collection, and some hard chain is returned", () => {
		M.eke('<div id=app class=blacklist1/>');
		M.eke('<div id=manapp class=blacklist1/>');

		M.lute('#app', {
			sound: () => {
				return true;
			}
		});

		M.lute('#manapp', {
			escape: () => {
				return true;
			}
		});
		expect(M('div').sound()).to.be.ok();//shall call warn
	});

	it("MUST: M returns single value by default  report", () => {
		M.eke('<div id=app class=blacklist1/>');
		M.eke('<div id=manapp class=blacklist1/>');

		M.lute('#app', {
			sound: () => {
				return 'paramparamparam';
			}
		});

		M.lute('.blacklist1', {
			sound: () => {
				return true;
			}
		});

		expect(M('div').sound()).to.equal('paramparamparam');
	});

	it("MUST: M returns report if called with W ", () => {
		M.eke('<div id=app class=blacklist1/>');
		M.eke('<div id=manapp class=blacklist1/>');

		M.lute('#app', {
			sound: () => {
				return 'paramparamparam';
			}
		});

		M.lute('.blacklist1', {
			sound: () => {
				return true;
			}
		});

		var o = M('div').W.sound();
		expect(o.length).to.equal(2);
	});


	it("method for more specific selector is applied", () => {
		M.eke('<div id=app class=blacklist1/>');
		M.eke('<div id=manapp class=blacklist1/>');

		M.lute('#app', {
			sound: () => {
				return 'paramparamparam';
			}
		});

		M.lute('.blacklist1', {
			sound: () => {
				return true;
			}
		});

		var o = M('div').W.sound();
		expect(o[0].returnValue).to.equal('paramparamparam');
		expect(o[1].returnValue).to.equal(true);
	});

	it("more complex case of specificity", () => {
		M.eke('<div id=app class=blacklist1/>');
		M.eke('<div id=manapp class=blacklist1/>');

		M.lute('#app', {
			sound: () => {
				return 'paramparamparam';
			}, 
			mute: () => {
				return 'mute';
			}
		});

		M.lute('.blacklist1', {
			sound: () => {
				return true;
			}
		});

		M.lute('#app.blacklist1', {
			sound: () => {
				return "app";
			}
		});

		var s = M('#app').W.sound();
		var m = M('#app').W.mute();

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

		M.lute('.child1', {
			test : () => {
				return true;
			}
		});
		var r = M('.child1').W.test();
		expect(r.length).to.equal(1);
		expect(r[0].returnValue).to.equal(true);
	});

	it("Invocation of nonexistent method does not results in exception", () => {
		M.control(document.getElementById('MorbidBase'));

		M.lute('.child1', {
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

	it("one can assign onclick listener via lute ", () => {
		M.control(document.getElementById('MorbidBase'));

		var itHasChanged = false;
		M.lute('.child1', {
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

		M.lute('.child1', {
			click : (event) => {
				expect(event.type).to.be.equal('click');
			}
		});

		$('.child1').trigger('click');
	});

	it("more specific listener takes precedence", () => {
		M.control(document.getElementById('MorbidBase'));
		var result = 0;
		M.lute('.child1', {
			click : (event) => {
				result = 1;
			}
		});

		M.lute('#host .child1', {
			click : (event) => {
				result = 2;
			}
		});

		$('.child1').trigger('click');
		expect(result).to.be.equal(2);

	});

	it("bulk addition works too", () => {
		M.control(document.getElementById('MorbidBase'));
		var result = 0;

		M.bulk({
			'.child1': {
				click : (event) => {
					result = 1;
				}
			}, 
			'#host .child1': {
				click : (event) => {
					result = 2;
				}
			}

		});

		$('.child1').trigger('click');
		expect(result).to.be.equal(2);
	});

	it("in method name we can specify space-separated multiple events", () => {
		M.control(document.getElementById('MorbidBase'));
		var result = 0;

		M.bulk({
			'.child1': {
				'click keyup' : (event) => {
					result++;
				}
			}
		});

		$('.child1').trigger('click').trigger('keyup');
		expect(result).to.be.equal(2);
	});

	it("lute allows to add rule with comma-separated selectors", () => {
		M.control(document.getElementById('MorbidBase'));
		var result = 0;
		M.lute('.child1, #host .child2', {
			click : (event) => {
				result++;
			}
		});

		$('.child1').trigger('click');
		$('.child2').trigger('click');
		expect(result).to.be.equal(2);
	});
});


