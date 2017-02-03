describe("Morbid is M(). and does following: ", function() {
	beforeEach(()=>{
		M.wipe();
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

	it("Morbid exists in a global namespace under letter M", () => {
		expect(M).to.be.ok();
	});

	it("It also is essentially a wrapper over good old jQuery, but you won't regret reading further. I promise you that.", () => {
		expect(M('span').length).to.be.equal(2);
		expect(M('span').closest('#host')).to.be.ok();
	});

	it("It manages pre-existing DOM", () => {
		expect(M('#host')[0].children.length).to.equal(2);
	});

	it("applies behaviours to pre-existing DOM using JQuery selectors. We call pair (selector, {eventOrMethodName: function}) a lute.", () => {
		expect(M.lute).to.be.ok();
		expect(M.bulk).to.be.ok();

		M.lute('.child1', {
			test : () => {
				return true;
			}
		});
	});

	it("You can add lutes one by one or with bulk method.", () => {
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



	it("Applied methods can be invoked like this:  M(selector).methodName() . M(selector) is, um, polymorphic decorator", () => {
		M.lute('.child1', {
			test : () => {
				return true;
			}
		});
		var r = M('.child1').test();
		expect(r).to.equal(true);
	});

	it("You can call method simply (get any single return with collection) or, using .W property. If W is used, you get a full report", () => {
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
		expect(M('#app').sound()=='paramparamparam').to.be.ok;
		var o = M('span').W.sound();
		expect(o.length).to.equal(2);
	});

	it(".W full report looks like array [{elementReference, returnValue}, ..] .W stands for nothing, it's just M upwards down.", () => {
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


	/*it("this works just like css. Rules in lute with higher specificity do override lower-specificity lute rules. Rules that are not overriden stay in effect. ", () => {
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
	});*/

	it("M(selector), just as $(selector), may operate over a set of DOM elements. It has every method found in every DOM item of collection   ", () => {
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

	it("M(selector).nonExistingMethod() does not results in exception. It's perfectly fine.", () => {
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

	it("On events specification and handling: ", ()  => {

		it("one can assign jquery event listener via lute ", () => {
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

		it("an event listener described in rule with higher specificity, overrides the one lower. They are not added up. e.stopImmediatePropagation in Morbid is same as e.stopPropagation() ", () => {
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

		it("in rule you can specify multiple events as space-separated string", () => {
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

		/*it("conflicting event listeners : listener of more specific selector fires, listeners of less specific are discarded", () => {
			var a1=false,a3=false;
			M.lute('.child1', {
				'click' : (event) => {
					a1++;
				}
			});

			M.lute('#app', {
				'click' : (event) => {
					a3++;
				}
			});

			var retval = M('.child1').trigger('click');
			expect(a3).to.be.ok();
			expect(!a1).to.be.ok();
		});*/

		it("if there is an event names conflict, Morbid will be unable to decide which one of listeners takes precedence, and will throw an exception. Good thing is that you get that one instantly.", () => {
			var a1=false, a2=false;
			
			try  {
				M.lute('.child1', {
					'click' : (event) => {},
					'click onkeyup' : (event) => {} });
			} catch( e ) {
				var res = e;
			}

			expect(res).to.be.ok();
		});

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

	

	

	it("Morbid effectively merges two consequent lutes with same selectors ", () => {
		var clickWork = false;
		M.lute('#app', {
			sound : (event) => {
				return 2;
			}
		});

		M.lute('#app', {
			'click' : (event) => {
				clickWork= true;
			}
		});
		M('#app').trigger('click');

		expect(M('#app').sound()==2).to.be.ok();
		expect(clickWork).to.be.ok();
	});

	it("Morbid overrides first added method if methods duplicate ", () => {
		var clickWork = false;
		M.lute('#app', {
			sound : (event) => {
				return 2;
			}
		});

		M.lute('#app', {
			sound : (event) => {
				return 3;
			}
		});
		expect(M('#app').sound()==3).to.be.ok();
	});

	it("Morbid overrides first added method if selectors are different but specificty is same, part 1 ", () => {
		var clickWork = false;
		M.lute('.child1', {
			sound : (event) => {
				return 2;
			}
		});

		M.lute('.childall', {
			sound : (event) => {
				return 3;
			}
		});
		expect(M('#app').sound()==3).to.be.ok();
	});

	it("Morbid overrides first added method if selectors are different but specificty is same, part 2 ", () => {
		var clickWork = false;

		M.lute('.childall', {
			sound : (event) => {
				return 3;
			}
		});

		M.lute('.child1', {
			sound : (event) => {
				return 2;
			}
		});
		expect(M('#app').sound()==2).to.be.ok();
	});


	it("Morbid exposes jquery methods wrapped in Morbid for single results", () => {
		var clickWork = false;

		M.lute('#MorbidBase', {
			fun : (event) => {
				return 'fun';
			}
		});
	
		expect(M('#app').closest).to.be.ok();
		expect(M('#app').closest('#MorbidBase')).to.be.ok();
		expect(M('#app').closest('#MorbidBase').fun()=="fun").to.be.ok();
	});

	it("Morbid exposes jquery methods wrapped in Morbid for single results, and does that not once", () => {
		var clickWork = false;

		M.lute('.childall', {
			fun : (event) => {
				return 'fun';
			}
		});
	
		expect(M('#app').closest).to.be.ok();
		var a = M('#app').closest('#MorbidBase').find('span').fun();
			expect(M('#app').closest('#MorbidBase').find('span').length).to.be.ok();
		expect(a).to.be.ok();
	});

});

describe("Morbid second bundle", function() {
	beforeEach(()=>{
		M.wipe();
		$('body').append('<div id=MorbidBase/>');
		$('#MorbidBase').html(`
			<div id="host">
				<input id=app class="child1 childall" value="pro100"/>
				<input id=app2 class="child1 childall" value="pro100"/>
			</div>

		`).hide();
		M.rein(document.getElementById('MorbidBase'));
	});

	afterEach(()=>{
		$('#MorbidBase').remove();
	});

	it("Morbid correctly exposes jquery val()", () => {
		expect(M('#app').val()=="pro100").to.be.ok();
	});

	it("Morbid binds this of method to M(specific instance) for singular call ", () => {
		M.lute('#app', {
			'fun': function(){
				return this.fun ? true:false;
			}
		});

		expect(M('#app').fun()).to.be.ok();
	});

	it("Morbid exposes jquery find method through this object in method ", () => {
		M.lute('#app', {
			'fun': function(){
				return this.find ? true:false;
			}
		});

		expect(M('#app').fun()).to.be.ok();
	});

	it("Morbid exposes jquery closest method through this object in method ", () => {
		M.lute('#app', {
			'fun': function(){
				return this.closest ? true:false;
			}
		});

		expect(M('#app').fun()).to.be.ok();
	});

	it("Morbid binds this of method to M(specific instance) for multiple call ", () => {
		M.lute('#host input', {
			'fun': function(){
				return this.fun ? true:false;
			}
		});
		var allTrue = _.every(M('input').W.fun(), (i) => i.returnValue)
		expect(allTrue).to.be.ok();
	});

	it("If function reference is passed in lute as method, Morbid assigns it correct this ", () => {
		function l(){
			return this['fun']? true: false;
		}
		M.lute('#host', {
			'fun': l
		});
		expect(M('#host').fun()).to.be.ok();
	});

	it("If function reference is passed in lute as eventhandler, Morbid assigns it correct this ", () => {
		var has = false;
		function l(){
			has =  this['find'] ? true: false;
		}
		M.lute('#host', {
			click: l
		});
		M('#host').trigger('click');
		expect(has).to.be.ok();
	});

	it("If function reference is passed in lute as eventhandler and event specifier is space-separated list Morbid assigns it correct this with jquery methods ", () => {
		var count = 0;
		function l(){
			debugger;
			count +=  this['find'] ? true: false;
		}
		M.lute('input', {
			'click onkeyup': l
		});
		M('input').trigger('click');
		expect(count==2).to.be.ok();
	});

	/*it("order of event listeners should be guaranteed", () => {
		expect(false).to.be.ok();
	});*/ //onkeyUp click and click onKeyDown passed simultaneously - what shall i do?? throw exception
	it("this object stays fresh all method long. If you change semantics, new methods become available, olds become unavailable", () => {
		expect(false).to.be.ok();

	});

});