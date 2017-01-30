(function(){

	var rootEl = document.createElement('div');
	var ruleMap = {};

	function getMethodNamesForItem(item) {
		return _.chain(ruleMap).pickBy((value,key) => {
				return jQuery(item).is(key);
			}).values().reduce((sum, item) => {
				return _.concat(sum, _.keys(item));
			}, []).value();
	}

	M = function(selector){
		var foundSet = jQuery(selector, rootEl);
		//we have, potentially, lots of elements and lots of styles.
		//iterate over set, define set of methods that are applicable to ANY element in set. 
		//fill returning object with those methods and methods of Morbid.

		let applicableMethods = _.chain(foundSet).map( getMethodNamesForItem ).flatten().value();

		function run(methodName){
			//search by rules that have method like this. Choose the most specific one. run it.
			var firstRandomSelectorWithMethod = _.findKey(ruleMap, (methods, cssSelector ) => {
				return methods[methodName];
			});
			var method = _.get(ruleMap, firstRandomSelectorWithMethod + '.' + methodName);
			if (!method) {
				console.warn('method ', methodName, ' is invoked for ', this, 'but is not present');
			} else return method.bind(this)();
		}

		debugger;
		_.each(foundSet, item => {
			_.each(applicableMethods, methodName => {
				foundSet[methodName] = run.bind(item, methodName);
			});
		});
		return foundSet;
	}

	M.domain = function(){
		console.log('domains are not supported yet');
	};

	M.append = function(parentSelectorOrEmmetString, emmetStringIfPresent) {//not an emmet yet, but wont stuck on that now.
		if (arguments.length==1) {
			return jQuery(rootEl).append(parentSelectorOrEmmetString);
		} else return jQuery(parentSelectorOrEmmetString, rootEl).append(emmetStringIfPresent);
	};

	M.undom = function(selector) {
		console.log('remove invoked');
	};

	//adds new css rule. No way to delete rule yet. Maybe there should not be.
	M.rule = function(selector, ruleObject) {
		ruleMap[selector] = ruleObject;
	};

	M.purge = function() {
		rootEl = document.createElement('div');
	}

	//we have a rules list, which are 
	//selector->ruleObject
	var CssHelper = {
		isApplicable: function(mItem, selector) {

		},
		getMatching: function(selector) {

		}
	};

})();