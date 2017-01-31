(function(){

	var rootEl = document.createElement('div');

	M = function(selector){
		var foundSet = jQuery(selector, rootEl);

		let allMethodsOfFoundElements = _.chain(foundSet).map( rules.getThis ).map((item) => _.keys(item)).flatten().uniq().value();

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

		_.each(allMethodsOfFoundElements, methodName => {
			foundSet[methodName] = run.bind(foundSet, methodName);
		});

		return foundSet;
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

	M.purge = function() {
		rootEl = document.createElement('div');
		rules.rulesSortedArray =  [];
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

	}.bind(rules);

	rules.getThis = function(domReference){
		const applicableRuleObjects = _.chain(this.rulesSortedArray).filter(
			(rO) => jQuery(domReference).is(rO.selector) ).map(rO => rO.ruleObject).value();

		var thisObject = _.partial(_.extend, {}).apply(window, applicableRuleObjects);
		//thisObject now should have actual methods with maximum specificity;
		//TODO ADD SOME MAP UNIQUE TO DOM ELEMENT
		return thisObject;
	}.bind(rules);


})();