(function(){


	const DAL = {//dom abstraction layer
		add: function (parentOrItsSelector, mi) {
			
		},

		undom: function (selectorOrElement) {

		},
		qsa: function(selector) {//queryselectorall

		}
	}

	M = function(selector){
		//jquery-like return from the collection.
		return objects;
	}

	var objects = [];

	function mI(first,id,className) {
		return {
			type: first,
			id,
			className
		};
	}

	M.domain = function(){
		console.log('domains are not supported yet');
	};

	M.add = function(typeStringOrValueObject, id, className) {
		objects.push(mI(typeStringOrValueObject, id, className));
		return true;
	};

	M.undom = function(type, id, className) {
		console.log('remove invoked');
	};

	//adds new css rule. No way to delete rule yet. Maybe there should not be.
	M.rule = function(selector, ruleObject) {

	};

	//purge current domain
	M.purge = function() {
		objects = [];
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

	//we need to focus on object management first.

})();