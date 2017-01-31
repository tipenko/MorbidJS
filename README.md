# MorbidJS
*"One can't simply define object behaviour like font-weight in css. Or can he?"*
*"Make javascript fun again"*

This is an experiment. I want to create Frontend inheritance framework similar to CSS selectors. So, methods are described in selectors like 

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
 - DOM is model.
 - Our purpose is to explore how css-like inheritance works. Not necessarily frontend.
 - Your component may change other component, on a higher level, in a
   different dom subtree. Messy? Price for simplicity.
 - If possible, store boolean and other states in class name. Css will adjust appearance, Morbid will adjust behaviour respectfully. 

