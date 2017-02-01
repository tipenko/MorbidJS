describe("Morbid second batch, DOM-related", function() {
	beforeEach(()=>{
		M.purge();
		$('body').append('<div id=MorbidBase/>');
		$('#MorbidBase').html(`
			<div id="host">
				<span id=app class="child1 childall"/>
				<span id=manapp class="child2 childall"/>
			</div>

		`).hide();
		M.rein(document.getElementById('MorbidBase'));
	});

	afterEach(()=>{
		$('#MorbidBase').remove();
	});

	it("exists in a global namespace", () => {
		expect(M).to.be.ok();
	});

	it("more complex case of specificity", () => {
		M.lute('#app', {
			sound: () => {
				return 'paramparamparam';
			}, 
			mute: () => {
				return 'mute';
			}
		});

		M.lute('.child1', {
			sound: () => {
				return true;
			}
		});

		M.lute('#app.child1', {
			sound: () => {
				return "app";
			}
		});

		var s = M('#app').W.sound();
		var m = M('#app').W.mute();

		expect(s[0].returnValue).to.equal('app');
		expect(m[0].returnValue).to.equal('mute');

		});

	it("method for more specific selector is applied", () => {
		M.lute('#app', {
			sound: () => {
				return 'paramparamparam';
			}
		});

		M.lute('.child2', {
			sound: () => {
				return true;
			}
		});

		var o = M('span').W.sound();
		expect(o[0].returnValue).to.equal('paramparamparam');
		expect(o[1].returnValue).to.equal(true);
	});



	it(" M returns report if called with W ", () => {
		M.lute('#app', {
			sound: () => {
				return 'paramparamparam';
			}
		});

		M.lute('.child2', {
			sound: () => {
				return true;
			}
		});

		var o = M('span').W.sound();
		expect(o.length).to.equal(2);
	});

	it("M returns single value by default ", () => {
		M.lute('#app', {
			sound: () => {
				return 'paramparamparam';
			}
		});

		M.lute('.child1', {
			sound: () => {
				return true;
			}
		});

		expect(M('span').sound()).to.equal('paramparamparam');
	});


	it("returns length 2 if two elements added", () => {
		expect(M('span').length).to.be.equal(2);
	});

	it("it is possible to add lute", () => {
		M.lute('.child1', {
			sound: () => {
				return true;
			}
		});
		expect(M('.child1').sound()).to.be.ok();
	});

	it("Morbid manages pre-existing DOM", () => {
		expect(M('#host')[0].children.length).to.equal(2);
	});

	it("Morbid applies behaviours to pre-existing DOM ", () => {
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
		M.lute('.child1', {
			click : (event) => {
				expect(event.type).to.be.equal('click');
			}
		});

		$('.child1').trigger('click');
	});

	it("more specific listener takes precedence", () => {
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

	it("there is a problem with events ", () => {
		expect(true).to.be.equal(false);
	});
});


