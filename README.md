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

That's it. This may get ugly soon, but i want to see it myself.

### Why? #
- Conditions and loops may turn out to be not necessary anymore;
- Faster development, smaller and cleaner code. Or not!
- Something funny i can't foresee yet.

### Which method or property takes precedence?##
Dig [CSS Specificity](https://developer.mozilla.org/en/docs/Web/CSS/Specificity), see [calculator](https://specificity.keegan.st/) here.

### How hard? #
- is based on JQuery and lodash, jquery methods are exposed in M response;
- no backend with build processes required;
- is supposed to be easy and lightweight.

### Data Model #
Morbid is backed by jQuery. This is not forever.

    M.append('<div id=app class=blacklist2/>')

*div#app.blacklist2* is created after this call, as a child of detached root element. This element will have behaviours provided by css-like behaviour sheets.

### Polymorphic decorator out-of-the-box #
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

 M('div').flush()
shall return

    [{elementReference: div.wc, returnValue:300 }]

you can see that .water has not been mentioned, and method has not been invoked. No error thrown. 
For each DOM element got into response, the most specific method is invoked.  


### Architecture. Reusability. Modularity. Design. Performance ###
MorbidJS is to create something you need extremely fast and small. If you have a team and a year-long project, consider something else. If you need a small widget to display in iframe - hello!
On the latter: It is slow, but it works. DOM storage is expensive, this object calculation is too. I will take care of this later.

### Commandments ###
10 YOU MUST STORE BUSINESS INSTANCES IN CSS-ACCESSIBLE WAY (IN DOM, VISIBLE OR NOT) AT ALL COSTS;
20 USE M(SELECTOR) TO ADRESS EVERYTHING EVERYTIME. PASSING REFERENCES IS HERESY;
30 USE INHERITANCE INSTEAD IF(). USE M() INSTEAD LOOPS() 