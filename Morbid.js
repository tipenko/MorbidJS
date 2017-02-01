(function(){

	var rootEl = document.createElement('div');

	M = function(selector){
		var foundSet = jQuery(selector, rootEl);

		function run(methodName){
			var meaningfulArguments = Array.prototype.slice.call(arguments); //arguments passed from caller
			meaningfulArguments.shift();
			//iterate over all elements of foundSet. If method is present for them, invoke it and report
			var report=[];

			_.each(foundSet, elementReference => {
				var thisObject = rules.getThis(elementReference);
				var method = thisObject[methodName];
				if (method) {
					var returnValue = method.apply(elementReference, meaningfulArguments);
					report.push({
						elementReference,
						returnValue
					});
				} 
			});
			return report;
		}

		var soleWrapper = new Proxy(foundSet, {
			get: (fs, name) => {
				if (fs[name]) return fs[name];
				if (name=="W") return multipleWrapper;
				//we have a name of a method. we have to iterate over collection 
				return () => {
						var a = Array.prototype.slice.call(arguments);
						a.splice(0,0, name);
						var report = run.apply(foundSet, a);
						if (_.isEmpty(report)) {
							return undefined;	
						}
						return report[0].returnValue;
					};
				}
		});

		var multipleWrapper = new Proxy(foundSet, {
			get: (fs, name) => {
				//we have a name of a method. we have to iterate over collection 
				return run.bind(foundSet, name);
			}
		});

		return soleWrapper;
	}

	function extractSoleFromReport(report) {
		return report[0].returnValue;
	}

	M.eke = function(parentSelectorOrEmmetString, emmetStringIfPresent) {//not an emmet yet, but wont stuck on that now.
		if (arguments.length==1) {
			return jQuery(rootEl).append(parentSelectorOrEmmetString);
		} else return jQuery(parentSelectorOrEmmetString, rootEl).append(emmetStringIfPresent);
	};

	//adds new css rule. No way to delete rule yet. Maybe there should not be.
	M.lute = function(selector, ruleObject) {
		if (selector.indexOf(',')!==-1) {
			var selectors = selector.split(',');
			return _.each(selectors, (selector) => {
				M.lute(selector, ruleObject);
			});
		}
		rules.addRule(selector, ruleObject);
	};

	//adds new css rule. No way to delete rule yet. Maybe there should not be.
	M.bulk = function(o) {
		_.forIn(o, (ruleObject, selector) => rules.addRule(selector, ruleObject) );
	};

	M.purge = function() {
		jQuery(rootEl).off();
		rootEl = document.createElement('div');
		rules.rulesSortedArray =  [];
	}

	M.control = function(elementReference) {
		rootEl= elementReference;
	}

	var rules = {
		rulesSortedArray: []
	};

	rules.addRule = function(selector, ruleObject){
		this.rulesSortedArray.push({
			selector,
			ruleObject
		});
		
		this.rulesSortedArray.sort((i1,i2) => {
			return SPECIFICITY.compare(i1.selector, i2.selector);
		});

		var delegatedMethods = _.pickBy(ruleObject, events.isValidEventSelector);

		_.mapKeys(delegatedMethods, (handler, eventName) => {
			jQuery(rootEl).on(eventName, selector, events.listener);
		});

	}.bind(rules);

	rules.getThis = function(domReference){
		const applicableRuleObjects = _.chain(this.rulesSortedArray).filter(
			(rO) => jQuery(domReference).is(rO.selector) ).map(rO => rO.ruleObject).value();

		var thisObject = _.partial(_.extend, {}).apply(window, applicableRuleObjects);
		
		//thisObject now should have actual methods with maximum specificity;
		//TODO ADD SOME MAP UNIQUE TO DOM ELEMENT
		return thisObject;
	}.bind(rules);

	var events = {
		jqEvents: ['blur',
			'focus',
			'focusin',
			'focusout',
			'load',
			'resize',
			'scroll',
			'unload',
			'click',
			'dblclick',
			'mousedown',
			'mouseup',
			'mousemove',
			'mouseover',
			'mouseout',
			'mouseenter',
			'mouseleave',
			'change',
			'select',
			'submit',
			'keydown',
			'keypress',
			'keyup',
			'error'],

		listener : function(event) {
			//here call our most specific method with proper binding
			var type = event.type;
			var to = rules.getThis(event.currentTarget);
			if (to[event.type]) {
				return to[event.type](event);
			}
			//if we got there, user has specified event name like 'click onkeyup',and we have to find a selector with substring.
			var oneRandomMatchingEventListener = _.chain(to).pickBy((fn, sel) => {
				return (sel.indexOf(event.type) !== -1);
			}).toPairs().first().last().value();

			return oneRandomMatchingEventListener(event);
		},

		isValidEventSelector: function(f, sel) {
			if (sel.indexOf(' ') !=-1){
				return true;
			}

			return events.jqEvents.includes(sel);
		}
	};

})();