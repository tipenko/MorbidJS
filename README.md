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

### Data Model #
Morbid is backed by jQuery. This is not forever.

    M.append('<div id=app class=blacklist2/>')

*div#app.blacklist2* is created after this call, as a child of detached root element. This element will have behaviours provided by css-like behaviour sheets.

At all costs, you MUST store business logic instance in CSS-addressable form, be it ul li for collections, data attributes or span with classes for properties. Don't store it in JS. This disrupts purpose of Morbid.

### Method Elevation And Silent Failure #
Decorator-like.
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

you can see that .water has not been mentioned, and method has not been invoked. No error thrown. That's what silent failure is.

### Architecture. Reusability. Modularity. Design. Performance ###
MorbidJS is to create something you need extremely fast and small. If you have a team and a year-long project, consider something else. If you need a small widget to display in iframe - hello!
On the latter: It is slow, but it works. DOM storage is expensive, this object calculation is too. I will take care of this later.

### Ideology ###
 - DOM is model;
 - At all cases use M(selector) to get access to logic and components. Do not pass references - use selectors. Single responsibility is not messed up: frontend is responsible for frontend, all fair;
 - At any cost, store boolean and other states in class name, attribute, through child-relationship or in any css-addressable form. Css will adjust appearance, Morbid will adjust behaviour respectfully;
 - In method's body extract as much as you can to methods. Using if(this.hasOneSelected)? Extract {} clause to separate method with a good name and override it in same rule with .has-one-selected in selector. 
 - An object's behaviour is subject to change in the middle of a method, and it's fun. Don't like it? There's React for you, go away. Don't forget your webpack and babel. We don't need them here.
 
 

