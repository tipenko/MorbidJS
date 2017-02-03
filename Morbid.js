(function() {

	var rootEl = document.createElement('div');
	var lutesSortedArray = [];

	var jqEvents = ['blur'
		, 'focus'
		, 'focusin'
		, 'focusout'
		, 'load'
		, 'resize'
		, 'scroll'
		, 'unload'
		, 'click'
		, 'dblclick'
		, 'mousedown'
		, 'mouseup'
		, 'mousemove'
		, 'mouseover'
		, 'mouseout'
		, 'mouseenter'
		, 'mouseleave'
		, 'change'
		, 'select'
		, 'submit'
		, 'keydown'
		, 'keypress'
		, 'keyup'
		, 'error'
	];

	function isNonJqueryDomManipulationFunction(jQuerySet, propertyName) {
		if (typeof jQuerySet[propertyName] !== 'function') return true;
		if (propertyName == "val") return true;
		return false;
	}

	M = function(selectorOrJQueryObject) {
		var foundSet = selectorOrJQueryObject.context ? selectorOrJQueryObject :
			jQuery(selectorOrJQueryObject, rootEl);

		//if selectorOrJQueryObject is jqueryObject, we should wrap it 

		function run(methodName) {

			var meaningfulArguments = Array.prototype.slice.call(arguments); //arguments passed from caller
			meaningfulArguments.shift();
			//iterate over all elements of foundSet. If method is present for them, invoke it and report
			var report = [];

			_.each(foundSet, elementReference => {
				var thisObject = getThis(elementReference);
				var method = thisObject[methodName];
				if (method) {

					var returnValue = method.apply(M(elementReference)
						, meaningfulArguments);
					report.push({
						elementReference
						, returnValue
					});
				}
			});
			return report;
		}

		var soleWrapper = new Proxy(foundSet, {
			get: (fs, name) => {
				if (fs[name]) {
					if (!isNonJqueryDomManipulationFunction(fs, name)) {
						return function(a) {
							//return M( (fs[name]).apply(fs, arguments); ) 
							return M(fs[name].apply(fs, arguments));
						}
					} else {
						return fs[name];
					}
					return fs[name];
				}

				if (name == "W") return multipleWrapper;
				//we have a name of a method. we have to iterate over collection 
				return function() {
					var a = Array.prototype.slice.call(arguments);
					a.splice(0, 0, name);
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

	//adds new css rule. No way to delete rule yet. Maybe there should not be.
	M.lute = function(selector, ruleObject) {
		if (selector.indexOf(',') !== -1) {
			var selectors = selector.split(',');
			return _.each(selectors, (selector) => {
				M.lute(selector, ruleObject);
			});
		}
		addLute(selector, ruleObject);
	};

	//adds new css rule. No way to delete rule yet. Maybe there should not be.
	M.bulk = function(o) {
		_.forIn(o, (ruleObject, selector) => addLute(selector, ruleObject));
	};

	M.wipe = function() {
		jQuery(rootEl).off();
		rootEl = document.createElement('div');
		lutesSortedArray = [];
	}

	M.rein = function(elementReference) {
		rootEl = elementReference;
	}

	//check that there is no pair of rules in ruleObject, that match the same event.
	//in this case it will be impossible to decide order of execution
	function validateRule(selector, ruleObject) {
		var properties = _.keys(ruleObject);
		var eventProperties = _.filter(properties, isValidEventSelector);
		if (_.isEmpty(eventProperties)) return;
		var eventsByOneTwoLevel = _.map(eventProperties, (key) => key.split(' '));
		var events = _.flatten(eventsByOneTwoLevel);
		var eventIndexToCount = _.countBy(events, eventName => _.indexOf(jqEvents
			, eventName));
		var eventIndexToCountWhereTwiceOrMore = _.pickBy(eventIndexToCount, quantity =>
			quantity > 1);
		var multipleEventIndexes = _.keys(eventIndexToCountWhereTwiceOrMore);
		var multipleEventNames = _.map(multipleEventIndexes, index => jqEvents[index]);

		if (multipleEventNames && multipleEventNames.length) {
			throw new Error(multipleEventNames.join(' and ') +
				'repeat more than once in passed rules object. This has no sense and behaviour is unpredictable. Remove one.'
			)
		}
	}

	function addLute(selector, ruleObject) {
		validateRule(selector, ruleObject);

		lutesSortedArray.push({
			selector
			, ruleObject
			, number: lutesSortedArray.length
		});

		lutesSortedArray.sort((i1, i2) => {
			var specificityComparison = SPECIFICITY.compare(i1.selector, i2.selector);
			if (specificityComparison != 0) return specificityComparison;
			return i1.number - i2.number;
		});

		var delegatedMethods = _.pickBy(ruleObject, (__, key) =>
			isValidEventSelector(key));

		_.mapKeys(delegatedMethods, (handler, eventName) => {
			jQuery(rootEl).on(eventName, selector, listener);
		});

	};

	function getThis(domReference) {
		const applicableLutes = _.filter(lutesSortedArray, lute => jQuery(
			domReference).is(lute.selector));

		//need to get topmost lutes with same ids.
		const ruleObjects = _.map(applicableLutes, lute => lute.ruleObject)

		var thisObject = _.partial(_.extend, {}).apply(window, ruleObjects);

		//thisObject now should have actual methods with maximum specificity;
		//TODO ADD SOME MAP UNIQUE TO DOM ELEMENT
		return thisObject;
	}

	function isValidEventSelector(sel) {
		if (sel.indexOf(' ') != -1) {
			return true;
		}

		return jqEvents.includes(sel);
	}

	function listener(event) {
		//here call our most specific method with proper binding
		var type = event.type;
		var to = getThis(event.currentTarget);
		if (to[event.type]) {
			return to[event.type].call(M(event.currentTarget), event);
		}
		//if we got there, user has specified event name like 'click onkeyup', and we have to find a selector with substring.
		var oneRandomMatchingEventListener = _.chain(to).pickBy((fn, sel) => {
			return (sel.indexOf(event.type) !== -1);
		}).toPairs().first().last().value();

		return oneRandomMatchingEventListener.call(M(event.currentTarget), event);
	}

})();