describe("Morbid puts M() in global namespace and does following: ", function() {
	beforeEach(() => {
		M.wipe();
		$('body').append('<div id=MorbidBase/>');
		$('#MorbidBase').html(
			`
			<div id="host">
				<span id=app class="child1 childall"/>
				<span id=manapp class="child2 childall"/>
			</div>

		`
		).hide();
		M.rein(document.getElementById('MorbidBase'));
	});

	afterEach(() => {
		$('#MorbidBase').remove();
	});

	it("Morbid exists in a global namespace under letter M", () => {
		expect(M).to.be.ok();
	});

	it("It's api is rather small and contains as little as four static methods"
		, () => {
			expect(M.rein).to.be.ok();
			expect(M.lute).to.be.ok();
			expect(M.bulk).to.be.ok();
			expect(M.wipe).to.be.ok();
			expect(Object.getOwnPropertyNames(M).length == 9).to.be.ok(); // that is our 4 plus usual ones
			//["length", "name", "arguments", "caller", "prototype", "lute", "bulk", "wipe", "rein"]
		});

	it(
		"It acts as a wrapper over good old jQuery, but you won't regret reading further. I promise you that."
		, () => {
			expect(M('span').length).to.be.equal(2);
			expect(M('span').closest('#host')).to.be.ok();
		});

	it("It manages pre-existing DOM", () => {
		expect(M('#host')[0].children.length).to.equal(2);
	});

	it(
		"applies behaviours to pre-existing DOM using JQuery selectors. We call pair (selector, {eventOrMethodName: function}) a lute."
		, () => {
			expect(M.lute).to.be.ok();
			expect(M.bulk).to.be.ok();

			M.lute('.child1', {
				test: () => {
					return true;
				}
			});
		});

	it("You can add lutes one by one or with bulk method.", () => {
		var result = 0;

		M.bulk({
			'.child1': {
				click: (event) => {
					result = 1;
				}
			}
			, '#host .child1': {
				click: (event) => {
					result = 2;
				}
			}

		});

		$('.child1').trigger('click');
		expect(result).to.be.equal(2);
	});



	it(
		"Applied methods can be invoked like this:  M(selector).methodName() . M(selector) is, um, polymorphic decorator"
		, () => {
			M.lute('.child1', {
				test: () => {
					return true;
				}
			});
			var r = M('.child1').test();
			expect(r).to.equal(true);
		});

	it(
		"You can call method simply (get any single return with collection) or, using .W property. If W is used, you get a full execution report"
		, () => {
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
			expect(M('#app').sound() == 'paramparamparam').to.be.ok;
			var o = M('span').W.sound();
			expect(o.length).to.equal(2);
		});

	it(
		".W full report looks like array [{elementReference, returnValue}, ..] .W stands for nothing, it's just M upwards down."
		, () => {
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

	it(
		"M(selector), just as $(selector), may operate over a set of DOM elements. It has every method found in every DOM item of collection   "
		, () => {
			M.lute('#app', {
				sound: () => {
					return 'paramparamparam';
				}
				, mute: () => {
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

	it(
		"M(selector).nonExistingMethod() does not results in exception. It's perfectly fine."
		, () => {
			M.lute('.child1', {
				test: () => {
					return true;
				}
			});
			var fine = undefined;
			try {
				M('.child1').explode();
				fine = true;
			} catch (e) {
				fine = false;
			}
			expect(fine).to.equal(true);
		});



	it("lute allows to add rule with comma-separated selectors", () => {
		var result = 0;
		M.lute('.child1, #host .child2', {
			click: (event) => {
				result++;
			}
		});

		$('.child1').trigger('click');
		$('.child2').trigger('click');
		expect(result).to.be.equal(2);
	});


	it("Morbid effectively merges two consequent lutes with same selectors ", () => {
		var clickWork = false;
		M.lute('#app', {
			sound: (event) => {
				return 2;
			}
		});

		M.lute('#app', {
			'click': (event) => {
				clickWork = true;
			}
		});
		M('#app').trigger('click');

		expect(M('#app').sound() == 2).to.be.ok();
		expect(clickWork).to.be.ok();
	});

	it(
		"Morbid overrides first added method if same methods are consequently added to system. Methods are not summed up, the latter overwrites the former"
		, () => {
			var clickWork = false;
			var firstNotCalled = true;
			M.lute('#app', {
				sound: (event) => {
					return 2;
					firstNotCalled = false;
				}
			});

			M.lute('#app', {
				sound: (event) => {
					return 3;
				}
			});
			expect(firstNotCalled).to.be.ok();
			expect(M('#app').sound() == 3).to.be.ok();
		});

	it(
		"Morbid overrides first added method if selectors are different but specificty is same, part 1 "
		, () => {
			var clickWork = false;
			M.lute('.child1', {
				sound: (event) => {
					return 2;
				}
			});

			M.lute('.childall', {
				sound: (event) => {
					return 3;
				}
			});
			expect(M('#app').sound() == 3).to.be.ok();
		});

	it(
		"Morbid overrides first added method if selectors are different but specificty is same, part 2 "
		, () => {
			var clickWork = false;

			M.lute('.childall', {
				sound: (event) => {
					return 3;
				}
			});

			M.lute('.child1', {
				sound: (event) => {
					return 2;
				}
			});
			expect(M('#app').sound() == 2).to.be.ok();
		});

});

describe("Handling events with Morbid ", () => {

	beforeEach(() => {
		M.wipe();
		$('body').append('<div id=MorbidBase/>');
		$('#MorbidBase').html(
			`
			<div id="host">
				<span id=app class="child1 childall"/>
				<span id=manapp class="child2 childall"/>
			</div>

		`
		).hide();
		M.rein(document.getElementById('MorbidBase'));
	});

	afterEach(() => {
		$('#MorbidBase').remove();
	});



	it("Event listener can be added with Morbid as well as method.. ", () => {
		var itHasChanged = false;
		M.lute('.child1', {
			click: () => {
				itHasChanged = true;
				return true;
			}
		});

		$('.child1').trigger('click');
		expect(itHasChanged).to.be.ok();
	});

	it("..and for event as well.", () => {
		M.lute('.child1', {
			click: (event) => {
				expect(event.type).to.be.equal('click');
			}
		});

		$('.child1').trigger('click');
	});

	it(
		"an event listener described in lute with higher specificity, overrides the one lower. They are not added up. e.stopImmediatePropagation in Morbid is same as e.stopPropagation()."
		, () => {
			var result = 0;
			M.lute('.child1', {
				click: (event) => {
					result = 1;
				}
			});

			M.lute('#host .child1', {
				click: (event) => {
					result = 2;
				}
			});

			$('.child1').trigger('click');
			expect(result).to.be.equal(2);
		});

	it("In rule you can specify multiple events as space-separated string", () => {
		var result = 0;

		M.bulk({
			'.child1': {
				'click keyup': (event) => {
					result++;
				}
			}
		});

		$('.child1').trigger('click').trigger('keyup');
		expect(result).to.be.equal(2);
	});

	it(
		"if there is an event names conflict, Morbid will be unable to decide which one of listeners takes precedence, and will throw an exception. Good thing is that you get that one instantly after M.lute/M.bulk."
		, () => {
			var a1 = false
				, a2 = false;

			try {
				M.lute('.child1', {
					'click': (event) => {}
					, 'click onkeyup': (event) => {}
				});
			} catch (e) {
				var res = e;
			}

			expect(res).to.be.ok();
		});

});

describe("Dom traversal and manipulation ", () => {
	beforeEach(() => {
		M.wipe();
		$('body').append('<div id=MorbidBase/>');
		$('#MorbidBase').html(
			`
			<div id="host">
				<span id=app class="child1 childall"/>
				<span id=manapp class="child2 childall"/>
			</div>

		`
		).hide();
		M.rein(document.getElementById('MorbidBase'));
	});

	afterEach(() => {
		$('#MorbidBase').remove();
	});


	it("You can use Morbid as JQuery wrapper. It exposes all of JQuery methods"
		, () => {
			var clickWork = false;

			M.lute('#MorbidBase', {
				fun: (event) => {
					return 'fun';
				}
			});

			expect(M('#app').closest).to.be.ok();
			expect(M('#app').closest('#MorbidBase')).to.be.ok();
			expect(M('#app').closest('#MorbidBase').fun() == "fun").to.be.ok();
		});

	it(
		"if JQuery method is dom manipulation or traverse method, it is wrapped in Morbid too. Chain does not breaks up until simple value is returned, it is always JQuery and then M while you are calling traverse methods."
		, () => {
			var clickWork = false;

			M.lute('.childall', {
				fun: (event) => {
					return 'fun';
				}
			});

			expect(M('#app').closest).to.be.ok();
			var a = M('#app').closest('#MorbidBase').find('span').fun();
			expect(M('#app').closest('#MorbidBase').find('span').length).to.be.ok();
			expect(a).to.be.ok();
		});

	it("Morbid correctly exposes jquery val()", () => {

		M.wipe();
		$('body').append('<div id=MorbidBase/>');
		$('#MorbidBase').html(
			`
			<div id="host">
				<input id=app class="child1 childall" value="pro100"/>
				<input id=app2 class="child1 childall" value="pro100"/>
			</div>

		`
		).hide();
		M.rein(document.getElementById('MorbidBase'));


		expect(M('#app').val() == "pro100").to.be.ok();
	});
});


describe("This object calculation", function() {

	beforeEach(() => {
		M.wipe();
		$('body').append('<div id=MorbidBase/>');
		$('#MorbidBase').html(
			`
			<div id="host">
				<input id=app class="child1 childall" value="pro100"/>
				<input id=app2 class="child1 childall" value="pro100"/>
			</div>

		`
		).hide();
		M.rein(document.getElementById('MorbidBase'));
	});

	afterEach(() => {
		$('#MorbidBase').remove();
	});


	it(
		"Morbid binds this of method to M(specific instance) for Morbid method invocation "
		, () => {
			M.lute('#app', {
				'fun': function() {
					return this.fun ? true : false;
				}
			});

			expect(M('#app').fun()).to.be.ok();
		});

	it("for multiple method invocation through W as well as for usual ones", () => {
		M.lute('#host input', {
			'fun': function() {
				return this.fun ? true : false;
			}
		});
		var allTrue = _.every(M('input').W.fun(), (i) => i.returnValue)
		expect(allTrue).to.be.ok();
	});



	it(
		"This object contains all JQuery methods. In fact, those of JQuery are returned instead of yours in case of name conflict. "
		, () => {
			M.lute('#app', {
				'fun': function() {
					return this.find ? true : false;
				}
			});

			expect(M('#app').fun()).to.be.ok();
		});

	it(
		"JQuery.closest() is also exposed through this, and it especially nice to use "
		, () => {
			M.lute('#app', {
				'fun': function() {
					return this.closest ? true : false;
				}
			});

			expect(M('#app').fun()).to.be.ok();
		});



	it(
		"All above works the same way if you pass function reference as method "
		, () => {
			function required() {
				return this['validate'] ? true : false;
			}
			M.lute('#host', {
				'validate': required
			});
			expect(M('#host').validate()).to.be.ok();
		});

	it("For events, too ", () => {
		var has = false;

		function l() {
			has = this['find'] ? true : false;
		}
		M.lute('#host', {
			click: l
		});
		M('#host').trigger('click');
		expect(has).to.be.ok();
	});

	it("for space-separated event lists in strings - too", () => {
		var count = 0;

		function l() {
			count += this['find'] ? true : false;
		}
		M.lute('input', {
			'click onkeyup': l
		});
		M('input').trigger('click');
		expect(count == 2).to.be.ok();
	});

});

describe("Upcoming tasks. These tests are supposed to fail", function() {
	beforeEach(() => {
		M.wipe();
		$('body').append('<div id=MorbidBase/>');
		$('#MorbidBase').html(
			`
			<div id="host">
				<input id=app class="child1 childall" value="pro100"/>
				<input id=app2 class="child1 childall" value="pro100"/>
			</div>

		`
		).hide();
		M.rein(document.getElementById('MorbidBase'));
	});

	afterEach(() => {
		$('#MorbidBase').remove();
	});

	it(
		"this object stays fresh all method long. If you change current dom element class in the middle, new methods become available, olds become unavailable"
		, () => {
			expect(false).to.be.ok();
		});

	it(
		"full execution report contains useful methods like &&all or lodash chain applied"
		, () => {
			expect(false).to.be.ok();
		});

	it("there is absolutely no real problem Morbid solves described in this document. Everybody hates frameworks so we have to provide and advertise something truly unique to justifty our existence"
	, () => {
		expect(false).to.be.ok();
	});
});