(function(){

	var rootEl = document.createElement('div');

	M = function(selector){
		return jQuery(selector, rootEl);
	}

	M.domain = function(){
		console.log('domains are not supported yet');
	};

	M.append = function(parentSelectorOrEmmetString, emmetStringIfPresent) {//not an emmet for now, but wont stuck on that now.
		if (arguments.length==1) {
			return jQuery(rootEl).append(parentSelectorOrEmmetString);
		} else return jQuery(parentSelectorOrEmmetString, rootEl).append(emmetStringIfPresent);
	};

	M.undom = function(type, id, className) {
		console.log('remove invoked');
	};

	//adds new css rule. No way to delete rule yet. Maybe there should not be.
	M.rule = function(selector, ruleObject) {

	};

	//purge current domain
	M.purge = function() {
		rootEl = document.createElement('div');
	}

	//we have a rules list, which are 
	//selector->ruleObject
	//we also have hierarchy of objects type, id, className, children, thisObject
	//we need to decide end object state.
	var CssHelper = {
		isApplicable: function(mItem, selector) {

		},
		getMatching: function(selector) {

		}
	};

})();