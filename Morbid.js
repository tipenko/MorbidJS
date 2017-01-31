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

	M.append = function(parentSelectorOrEmmetString, emmetStringIfPresent) {//not an emmet yet, but wont stuck on that now.
		if (arguments.length==1) {
			return jQuery(rootEl).append(parentSelectorOrEmmetString);
		} else return jQuery(parentSelectorOrEmmetString, rootEl).append(emmetStringIfPresent);
	};

	//adds new css rule. No way to delete rule yet. Maybe there should not be.
	M.rule = function(selector, ruleObject) {
		rules.addRule(selector, ruleObject);
	};

	//adds new css rule. No way to delete rule yet. Maybe there should not be.
	M.rulebulk = function(o) {
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

		var delegatedMethods = _.pick(ruleObject, events.jqEvents);

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
			rules.getThis(event.currentTarget)[event.type](event);
		}
	};

})();