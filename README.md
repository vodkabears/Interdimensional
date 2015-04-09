Interdimensional
========

[![NPM version](https://img.shields.io/npm/v/interdimensional.svg?style=flat)](https://npmjs.org/package/interdimensional)
[![Bower version](https://badge.fury.io/bo/interdimensional.svg)](http://badge.fury.io/bo/interdimensional)
[![Travis](https://travis-ci.org/VodkaBears/Interdimensional.svg?branch=master)](https://travis-ci.org/VodkaBears/Interdimensional)
[![devDependency Status](https://david-dm.org/vodkabears/interdimensional/dev-status.svg)](https://david-dm.org/vodkabears/interdimensional#info=devDependencies)

Spatial scrolling for your web pages.

##Notes

Only modern devices are supported. Developed on iOs 8.

##Demo
![demo](https://raw.githubusercontent.com/VodkaBears/vodkabears.github.com/master/interdimensional/demo.gif)

##Getting started

Install through npm or bower or [download from GitHub](https://github.com/VodkaBears/Interdimensional/releases):

```js
npm install interdimensional
bower install interdimensional
```

Include the javascript library from the dist folder:
```html
<script src="../dist/interdimensional.js"></script>
```

Include this CSS file, if you want to use the default control:
```html
<link rel="stylesheet" href="../dist/interdimensional.css">
```

Charge it! See options in the [API section](#api).

```js
Interdimensional.charge();
```

##API

####Interdimensional.charge(options)

Initializes Interdimensional. This methods is async. Triggers `interdimensional:charge`(success) or `interdimensional:fail`(if something is unsupported). See [the section about events](#events).

######Options and default values:

```js
Interdimensional.charge({

  /**
   * Pixels per difference between tilts
   * @type {Number}
   */
  PPD: 0.8,

  /**
   * Minimum difference between tilts
   * @type {Number}
   */
  insensitivity: 5,

  /**
   * Use the control or not
   * @type {Boolean}
   */
  useControl: true,

  /**
   * Interdimensional control
   *
   * If null - default control will be used
   * control: document.getElementById('myControl')
   *
   * @type {HTMLElement|null}
   */
  control: null  
});
```

####Interdimensional.jump()

Interdimensional jump. Enables the spatial scrolling. It is not needed, if you use only the default control.  Triggers `interdimensional:jump`.

```js
document.addEventListener('interdimensional:charge', function() {
  Interdimensional.jump();
}, false);
```

####Interdimensional.kick()

Interdimensional kick. Disables the spatial scrolling. It is not needed, if you use only the default control. Triggers `interdimensional:kick`.

####Interdimensional.toggle()

Interdimensional toggle. Toggles the spatial scrolling. It is not needed, if you use only the default control.

####Interdimensional.discharge()

Interdimensional discharge. Destroys - removes event listeners, controls and etc. Triggers `interdimensional:discharge`.

####Interdimensional.isCharged()

Returns `true` if Interdimensional is ready.

####Interdimensional.isOn()

Returns `true` if Interdimensional is already scrolling the page.

##Events

####interdimensional:charge

```js
document.addEventListener('interdimensional:charge', function() {
  console.log('Charged!');
}, false);
```

####interdimensional:fail

```js
document.addEventListener('interdimensional:fail', function() {
  console.log('Charging is failed.');
}, false);
```

####interdimensional:jump

```js
document.addEventListener('interdimensional:jump', function() {
  console.log('Spatial scrolling is on!');
}, false);
```

####interdimensional:kick

```js
document.addEventListener('interdimensional:kick', function() {
  console.log('Spatial scrolling is off.');
}, false);
```

####interdimensional:discharge

```js
document.addEventListener('interdimensional:discharge', function() {
  console.log('Destroyed.');
}, false);
```

##CONTRIBUTING

Do you have any ideas? Do you know any bugs?

1. Fork.
2. Run `npm start`.
3. Make your changes on the `src` folder.
4. Update tests.
5. Run `npm test`, make sure everything is okay.
6. Submit a pull request to the master branch.

Thanks.

##License

The MIT License (MIT)

Copyright (c) 2015 Ilya Makarov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
