# MorbidJS
*One can't simply define object behaviour like font-weight in css. Or can he?*

This is an experiment. I want to create inheritance framework similar to CSS selectors. So, methods are described in selectors like 

    .kitten {
    	sound: () => {
    		console.log('meow');
    	}
    }

	.kitten.saturated {
		sound: () => {
			console.log('purr');
		}
	}

That's it.  This will get ugly soon, but i want to see it myself.

### Cascading methods from parent##
I'll give it a thought later.

## Which method takes precedence?##
Dig [CSS Specificity](https://developer.mozilla.org/en/docs/Web/CSS/Specificity), see [calculator](https://specificity.keegan.st/) here.

## Ideology ##
 - Your task is unique, your code is too. Fuck reusability. Framework
   handles commonplace. 
 - Fuck SOLID, whatever this means. 
 - Your component may change other component, on a higher level, in a
   different dom subtree. Messy? Price for simplicity.

