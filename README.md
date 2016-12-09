# ember-sliding-menu

IT'S WIP. If you're seeing this message - wait a few days before it become more stable!
TODOS:
- test
- optimise (get rid of jquery - completely)
- update readme and make a demo
- add option to move content instead of moving menu
- fix toLeft, only toRight is working now
Thanks!

This is convenient component representing the mobile sliding-menu.
It has some features since it was designed for mobile applications at first:

- Performance optimized for mobile applications (tested for cordova app on iOS)
- It has the effect of inertia
- Highly customizable
- Separated handler so your app won't experience any conflict
- Easy to use (see below)
- For desktop apps there is a commented frost-glass effect logic (on your own risk)

**You can find more convenient page [here](http://blackening999.github.io/ember-sliding-menu)**

## Dependencies
- [Hammer](https://github.com/hammerjs/hammer.js)

## Installation

* `ember install sliding-menu` this repository

## Usage
1. Use the component where you need it
```js
  {{#sliding-menu
    slideDirection='toRight'
    appIdentifier='.ember-application'
    pannableWidth=65
    menuOffset=25
  }}
    //... your menu items goes here
  {{/sliding-menu}}
```

Add some styles (not included intentionally):
```css
.sliding-menu {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    -webkit-transform: translateZ(0);
    -webkit-perspective: 1000;
    -webkit-backface-visibility: hidden;
    visibility: hidden;
    will-change: transform;
    z-index: 110;
    border: none;
    background: #ffffff;
  }
```

2. Add optionally a component for handling menu toggling outside
```js
  {{#toggle-sliding-menu
    tagName='button'
    className='hamburger-menu-holder'
  }}
    <span class="hamburger-holder">
      <span class="hamburger"></span>
    </span>
  {{/toggle-sliding-menu}}
```

3. Add optionally background overlay component.
It allows you to close menu by clicking outside
```js
  {{background-overlay}}
```

Add some styles (not included intentionally):
```css
.background-overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    visibility: hidden;
  }
```

That's all. Now everything you need is decorate your menu

*P.S. In order to get rid from any possible glitches it's highly recommended to set
property appIdentifier not to '.ember-application' container itself(default) but to its descendant.
In the example above I'm using className - '.app' for Application's View*


## Example
[Ember Cli Sliding Menu EXAMPLE](https://github.com/Blackening999/testing-menu)
Here you can find convenient example with bucket of supporting features, like:
- **background-overlay** which gives an opportunity to close menu by clicking to the free of opened menu
- **toggle-menu** which helps to handle menu open/close via buttons click/action


## Options
There are plenty of options available.

1. Transition trough menu item with menu-closing
In your application controller:
```js
  import Ember from 'ember';
  import MenuHelper from 'testing-menu/mixins/menu-helper';

  export default Ember.Controller.extend(MenuHelper, {});
```

Add menu item
```js
      <div class="menu">
          <div {{action "transitionFromMenu" "home"}} class="menu-item">Home page</div>
    </div>
```

2. Options represented by properties you can pass to component:
- slideDirection: @String 'toLeft|toRight' default: 'toLeft' - menu placement, toLeft means from right to left
- pannableWidth: @Number  > 0              default: 40       - width of zone where menu can be invoked
- defaultSpeed: @Double   > 0.00 && < 1.00 default: 0.03     - menu animation speed


## Author

  [Vladimir Katansky](http://github.com/Blackening999)

## License

(The MIT License)

Copyright (c) 2016 Vladimir Katansky

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
