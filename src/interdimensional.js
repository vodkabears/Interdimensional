!(function(window, document) {
  'use strict';

  /**
   * Settings with default values
   * @private
   * @type {Object}
   */
  var settings = {
    speed: 150,
    insensitivity: 5,
    useControl: true
  };

  /**
   * Is ready to jump?
   * @private
   * @type {Boolean}
   */
  var isCharged = false;

  /**
   * Is preparing to be ready or no?
   * @private
   * @type {Boolean}
   */
  var isCharging = false;

  /**
   * Is the spatial scrolling on?
   * @private
   * @type {Boolean}
   */
  var isOn = false;

  /**
   * Last orientation of the device around the Z axis
   * @see https://developer.mozilla.org/en-US/docs/Web/Events/deviceorientation
   * @private
   * @type {Number}
   */
  var lastAlpha;

  /**
   * Last orientation of the device around the X axis
   * @see https://developer.mozilla.org/en-US/docs/Web/Events/deviceorientation
   * @private
   * @type {Number}
   */
  var lastBeta;

  /**
   * Last orientation of the device around the Y axis
   * @see https://developer.mozilla.org/en-US/docs/Web/Events/deviceorientation
   * @private
   * @type {Number}
   */
  var lastGamma;

  /**
   * Interdimensional controller
   * @private
   * @type {HTMLElement}
   */
  var control;

  /**
   * Checks support of necessary features
   * @private
   * @param {Function} next
   */
  function checkSupport(next) {
    window.addEventListener('deviceorientation', function checkDeviceOrientationEvent(e) {
      window.removeEventListener('deviceorientation', checkDeviceOrientationEvent, false);

      // Check support of the deviceorientation event and touch events
      if ((('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) &&
        (e.alpha != null || e.beta != null || e.gamma != null)) {

        next();
      }
    }, false);
  }

  /**
   * Parses a string with options
   * @private
   * @param   {String} str
   * @returns {Object|String}
   */
  function parseOptions(str) {
    var obj = {};
    var delimiterIndex;
    var option;
    var prop;
    var val;
    var arr;
    var len;
    var i;

    // remove spaces around delimiters and split
    arr = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',').split(',');

    // parse a string
    for (i = 0, len = arr.length; i < len; i++) {
      option = arr[i];

      // Ignore urls and a string without colon delimiters
      if (option.search(/^(http|https|ftp):\/\//) !== -1 ||
        option.search(':') === -1) {

        break;
      }

      delimiterIndex = option.indexOf(':');
      prop = option.substring(0, delimiterIndex);
      val = option.substring(delimiterIndex + 1);

      // if val is an empty string, make it undefined
      if (!val) {
        val = undefined;
      }

      // convert a string value if it is like a boolean
      if (typeof val === 'string') {
        val = val === 'true' || (val === 'false' ? false : val);
      }

      // convert a string value if it is like a number
      if (typeof val === 'string') {
        val = !isNaN(val) ? +val : val;
      }

      obj[prop] = val;
    }

    // if nothing is parsed
    if (prop == null && val == null) {
      return str;
    }

    return obj;
  }

  /**
   * Calculates a number of pixels to scroll
   * @private
   * @param  {Number} lastAngle Last orientation
   * @param  {Number} newAngle New orientation
   * @return {Number} Pixels to scroll
   */
  function calcShift(lastAngle, newAngle) {
    var diff = newAngle - lastAngle;
    var absDiff = Math.abs(diff);
    var sign = diff === 0 ? 0 : diff / absDiff;

    return absDiff > settings.insensitivity ?
      settings.speed * ((newAngle - sign * settings.insensitivity) / lastAngle - 1) : 0;
  }

  /**
   * Enables/disables the spatial scrolling
   * @private
   * @listens touchstart
   */
  function handleTouchStartEvent() {
    Interdimensional.toggle();
  }

  /**
   * Scrolls the page
   * @private
   * @listens deviceorientation
   * @param {Event} e
   */
  function handleDeviceOrientationEvent(e) {
    if (!isOn || (lastAlpha == null && lastBeta == null)) {
      lastAlpha = e.alpha;
      lastBeta = e.beta;
      lastGamma = e.gamma;
    } else {
      if (window.innerHeight > window.innerWidth) {
        window.scrollBy(
          calcShift(lastAlpha, e.alpha),
          calcShift(lastBeta, e.beta)
        );
      } else {
        window.scrollBy(
          calcShift(lastBeta, e.beta),
          calcShift(lastGamma, e.gamma)
        );
      }
    }
  }

  /**
   * Disables the spacial scrolling
   * @private
   * @listens orientationchange
   */
  function handleOrientationChangeEvent() {
    Interdimensional.kick();
  }

  /**
   * Initializes declaratively
   * @private
   * @listens DOMContentLoaded
   */
  function handleDOMContentLoadedEvent() {
    var data = document.body.getAttribute('data-interdimensional');

    if (data != null) {
      Interdimensional.charge(parseOptions(data));
    }
  }

  /**
   * @private
   * @constructor
   */
  function Interdimensional() {}

  /**
   * Initializes
   * @public
   * @param {Object} options
   */
  Interdimensional.charge = function(options) {
    if (!isCharged && !isCharging) {
      isCharging = true;

      checkSupport(function() {
        isCharged = true;
        isCharging = false;

        // Set settings
        for (var key in options) {
          settings[key] = options[key];
        }

        // Create the control
        control = document.createElement('div');
        control.className = 'interdimensional-control';
        settings.useControl && document.body.appendChild(control);

        // Add event listeners
        control.addEventListener('touchstart', handleTouchStartEvent, false);
        window.addEventListener('deviceorientation', handleDeviceOrientationEvent, false);
        window.addEventListener('orientationchange', handleOrientationChangeEvent, false);
      });
    }
  };

  /**
   * Enables the spatial scrolling
   * @public
   */
  Interdimensional.jump = function() {
    if (!isCharged) {
      return;
    }

    isOn = true;
    control.classList.add('interdimensional-control-is-active');
  };

  /**
   * Disables the spatial scrolling
   * @public
   */
  Interdimensional.kick = function() {
    if (!isCharged) {
      return;
    }

    isOn = false;
    control.classList.remove('interdimensional-control-is-active');
  };

  /**
   * Toggles the spatial scrolling
   * @public
   */
  Interdimensional.toggle = function() {
    isOn ? Interdimensional.kick() : Interdimensional.jump();
  };

  /**
   * Destroys
   * @public
   */
  Interdimensional.discharge = function() {
    if (!isCharged) {
      return;
    }

    Interdimensional.kick();

    isCharged = false;
    settings.useControl && document.body.removeChild(control);

    // Remove event listeners
    control.removeEventListener('touchstart', handleTouchStartEvent, false);
    window.removeEventListener('deviceorientation', handleDeviceOrientationEvent, false);
    window.removeEventListener('orientationchange', handleOrientationChangeEvent, false);
  };

  document.addEventListener('DOMContentLoaded', handleDOMContentLoadedEvent, false);

  window.Interdimensional = Interdimensional;
})(window, document);
