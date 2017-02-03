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


### Warning: this text a bit outdated ! #
As this is in early development stage and we ( in quantity of one ) are eager to see results, framework itself comes first and readme comes second. But tests comes zero, and are 100% up to date no matter what.

Please, see [Unit tests in your browser](https://cdn.rawgit.com/tipenko/MorbidJS/master/mocha-public.html). I am very serious about making them as easy to read as comics book.

### Why we do Morbid? #
- Conditions and loops may turn out not to be not necessary anymore;
- Smaller methods;
- Faster development, smaller and cleaner code. Or not!
- Software development process may change with Morbid (i.e. it may turn out that lute-sorting IDE is much more efficient then code editing) 
- Something funny i can't foresee yet.

### Which method takes precedence?##
Dig [CSS Specificity](https://developer.mozilla.org/en/docs/Web/CSS/Specificity), see [calculator](https://specificity.keegan.st/) here.

### How hard? #
- it is based on JQuery and lodash, JQuery methods are exposed in M response;
- no backend with build processes required;
- it is supposed to be easy and lightweight.

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

    (typeof M('div').W.flush=="function" && typeof M('div').W.stink=="function") == true

 M('div').W.flush()

shall return

    [{elementReference: div.wc, returnValue:300 }]

while 

    M('div').flush()

shall return 
        
    300;

you can see that .water has not been mentioned, and method has not been invoked. No error thrown. 
For each DOM element got into response, the most specific method is invoked.
There is Proxies under the hood, so invoking missing method is perfectly legal and causes no exception.

All JQuery methods are exposed and infinitely chained through Morbid decorator, so 
    
    M('#app').closest('#MorbidBase').find('span').fun()

is absolutely valid and shall return the result of 'fun' method
 
### "super" equivalent #
Is not implemented yet. Maybe it should not be.

### Events model and rule conflict resolution#
You can specify the following words as method names, and they will be fed to jQuery.on:

    blur, focus, focusin, focusout, load, resize, scroll, unload, click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, error

All other keys are treated as methods and can be invoked through M(selector).
If two rules have the same specificity and declare one method or event, the first added method or event will be overwritten.

Same as JQuery, Morbid used bubbling-only event model. StopImmediatePropagation this time has no difference with stopPropagation.
If you love capturing and don't know how to deal without it, remember what Morbid is. You have unlimited power of CSS selectors from now on. 

Events are not added up. Two event listeners with same specificity cannot exist in Morbid.

### Difference between events and methods#
1) You can specify events with space-separated string like 'onkeyup click' 2) eventhandlet gets event as param 

This should be all.

### Where do I store data? #
In DOM.

If your app is simple, it may be fine to store data exactly where it is displayed. If not, store it in invisible body>div.#b (b for business)

Performance aside, we see one bad thing: you may need to visually display business item on screen twice or more, and that's not nice. For now, you have to deal with it.


String, number and date values are to be stored as discrete spans\divs (and accessed via #b .account>.phonenumber) or as attributes.


Collections must be stored as ul>li or else, but every collection item must be separate DOM element and be nested exactly in DOM element with meaningful class or id.

### Javascript consideration #
This object: in progress

Event methods: stopImmediatePropagation() makes no difference with stopPropagation().

Avoid creating plain javascript objects with logic. Morbid handles logic.


### Browser support #
Limited by Proxy API. Won't work in IE 11.



### Architecture. Reusability. Modularity. Design. Performance ###
MorbidJS is to create something you need extremely fast and small. 

If you have a team and a year-long project, consider something else. If you need a small widget to display in iframe - hello!

Performance-wise: It is slow, but it works. DOM storage is expensive, as well as this object calculation. I will take care of this later.

### Commandments for the brave who use Morbid for their cause###
10 YOU MUST STORE BUSINESS INSTANCES IN CSS-ACCESSIBLE WAY (IN DOM, VISIBLE OR NOT) AT ALL COSTS;

20 USE M(SELECTOR) TO ADDRESS EVERYTHING EVERYTIME. PASSING REFERENCES IS HERESY;

30 USE INHERITANCE INSTEAD IF(). USE M() INSTEAD LOOPS() 

40 DO NOT USE METHOD IF METHOD WITH SAME NAME IS PRESENT IN JQUERY


### Commandments for those who write Morbid ###
00 UNIT TESTS

10 API IS NOT EXTENDED UNTIL THERE'S AN APPLICATION WHICH NEEDS IT

20 REFACTORING IS ALWAYS WELCOME

30 DONT CARE ABOUT SPEED, MEMORY CONSUMPTION AND MODULARITY UNTIL IT'S TIME.

### Embark and endeavour ###

I deeply believe that Morbid may become the face of frontend in next few years.

I desperately need help.

If you have time and think you can help - be it renaming and adding unit test, correcting mistakes in this document, writing rule debugger, css-like syntax translator or else - 
contact founder by gmail. Adress is same as github id @gmail.com
