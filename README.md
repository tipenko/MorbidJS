# MorbidJS
*"Make frontend fun again"*

This is an experiment. I want to create framework with inheritance similar to CSS selectors specificity. So, methods are described in selectors like 

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

That's it.  This may get ugly soon, but i want to see it myself.

### Why? #
- Conditions and loops may turn out to be not necessary anymore;
- Faster development, smaller and cleaner code; Or not.
- Something funny i can't foresee yet.

### Model #
Morbid is backed by jQuery. This is not forever.

    M.append('<div id=app class=blacklist2/>')

*div#app.blacklist2* is created after this call, as a child of detached root element. This element will have behaviours provided by css-like behaviour sheets.

### Method elevation #
Given

        .wc {
            flush: () => 300;
        }
        
        .water {
            stink: () => {}
        }

    <div class="wc"><div class="water"/></div>
we have 

    (typeof M('div').flush=="function" && typeof M('div').stink=="function") == true

### Silent failure #
Same as above, 

    M('div').flush()
shall return

    [{elementReference: div.wc, returnValue:300 }]
you can see that .water has not been mentioned, method has not been invoked. That's what silent failure is.

### Which method or property takes precedence?##
Dig [CSS Specificity](https://developer.mozilla.org/en/docs/Web/CSS/Specificity), see [calculator](https://specificity.keegan.st/) here.

### Ideology ###
 - DOM is model;
 - At all cases use M(selector) to get access to logic and components. Do not pass references - use selectors. Single responsibility is not messed up: frontend is responsible for frontend, all fair;
 - If possible, store boolean and other states in class name. Css will adjust appearance, Morbid will adjust behaviour respectfully;
 - Extract as much as you can to methods. Using if () == doing it wrong;
 - An object's behaviour is subject to change in the middle of a method, and it's fun. Don't like it? There's React for you, go away.

