/*
 *  Interdimensional - v0.0.2
 *  Spatial scrolling for your web pages.
 *  http://vodkabears.github.io/interdimensional/
 *
 *  Made by Ilya Makarov <dfrost.00@gmail.com>
 *  Under MIT License
 */

!(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Interdimensional = factory();
  }
})(this, function() {

  'use strict';

  /**
   * Crossbrowser requestAnimationFrame
   * @private
   * @returns {Function}
   */
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      setTimeout(callback, 1000 / 60);
    };

  /**
   * Default settings
   * @private
   * @const
   * @type {Object}
   */
  var DEFAULT_SETTINGS = {

    // Pixels per difference
    PPD: 0.8,
    insensitivity: 5,
    useControl: true,
    control: null
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
   * Current settings
   * @private
   * @type {Object}
   */
  var settings;

  /**
   * Interdimensional controller
   * @private
   * @type {HTMLElement}
   */
  var control;

  /**
   * Number of pixels of x-axis to scroll
   * @private
   * @type {Number}
   */
  var stepX = 0;

  /**
   * Number of pixels of y-axis to scroll
   * @private
   * @type {Number}
   */
  var stepY = 0;

  /**
   * Checks support of necessary features
   * @private
   * @param {Function} success
   * @param {Function} fail
   */
  function checkSupport(success, fail) {

    // Check the deviceorientation event and touch events
    if (!('DeviceOrientationEvent' in window)) {
      return fail();
    }

    // Call fail(), if the event was not triggered
    var failTimeout = setTimeout(function() {
      window.removeEventListener('deviceorientation', deviceOrientationHandler, false);
      fail();
    }, 2000);

    var deviceOrientationHandler = function(e) {
      clearTimeout(failTimeout);
      window.removeEventListener('deviceorientation', deviceOrientationHandler, false);

      if (!isCharging) {
        return;
      }

      if ((e.alpha != null || e.beta != null || e.gamma != null)) {
        success();
      } else {
        fail();
      }
    };

    // Check the deviceorientation event in the action
    window.addEventListener('deviceorientation', deviceOrientationHandler, false);
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
      settings.PPD * (diff - sign * settings.insensitivity) : 0;
  }

  /**
   * Triggers events
   * @private
   * @param {String} Name of an event
   */
  function trigger(eventName) {
    var e;

    if (!eventName) {
      return;
    }

    // Add namespace
    eventName = 'interdimensional:' + eventName;

    if (!window.Event || typeof window.Event !== 'function') {

      // The old way
      e = document.createEvent('Event');
      e.initEvent(eventName, true, true);
    } else {

      // The new way
      e = new Event(eventName);
    }

    document.dispatchEvent(e);
  }

  /**
   * Scrolls
   * @private
   */
  function scroll() {
    window.scrollBy(stepX, stepY);
    isOn && requestAnimationFrame(scroll);
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
    if (!isOn || (lastAlpha == null || lastBeta == null || lastGamma == null)) {
      lastAlpha = e.alpha;
      lastBeta = e.beta;
      lastGamma = e.gamma;
    } else {
      if (window.innerHeight > window.innerWidth) {
        stepX = calcShift(lastGamma, e.gamma);
        stepY = calcShift(lastBeta, Math.abs(e.gamma) > 90 && Math.abs(lastGamma) < 90 ? 180 - e.beta : e.beta);
      } else {
        stepX = calcShift(lastAlpha, e.alpha);
        stepY = calcShift(Math.abs(lastGamma), Math.abs(e.gamma));
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

  return {

    /**
     * @public
     * @returns {Boolean} `isCharged` variable
     */
    isCharged: function() {
      return isCharged;
    },

    /**
     * @public
     * @returns {Boolean} `isOn` variable
     */
    isOn: function() {
      return isOn;
    },

    /**
     * Initializes
     * @public
     * @param {Object} options
     * @param {Number} options.PPD Pixels per difference between tilts
     * @param {Number} options.insensitivity Minimum difference between tilts
     * @param {Boolean} options.useControl Use the control or not
     * @param {HTMLElement|null} options.control Interdimensional control, if null - the default control will be used
     */
    charge: function(options) {
      if (!isCharged && !isCharging) {
        isCharging = true;

        checkSupport(function() {
          isCharged = true;
          isCharging = false;

          // Set settings
          settings = {};
          for (var key in DEFAULT_SETTINGS) {
            if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
              options && typeof options[key] !== 'undefined' ?
                settings[key] = options[key] :
                settings[key] = DEFAULT_SETTINGS[key];
            }
          }

          // Create the control
          if (settings.control) {
            control = settings.control;
          } else {
            control = document.createElement('div');
            control.className = 'interdimensional-control';
          }

          // Add the control
          !settings.control && settings.useControl && document.body.appendChild(control);

          // Add event listeners
          control.addEventListener('touchstart', handleTouchStartEvent, false);
          window.addEventListener('deviceorientation', handleDeviceOrientationEvent, false);
          window.addEventListener('orientationchange', handleOrientationChangeEvent, false);

          trigger('charge');
        },

        function() {
          isCharging = false;
          trigger('fail');
        });
      }
    },

    /**
     * Enables the spatial scrolling
     * @public
     */
    jump: function() {
      if (!isCharged) {
        return;
      }

      isOn = true;
      control.classList.add('interdimensional-control-is-active');
      scroll();

      trigger('jump');
    },

    /**
     * Disables the spatial scrolling
     * @public
     */
    kick: function() {
      if (!isCharged) {
        return;
      }

      isOn = false;
      stepX = 0;
      stepY = 0;
      control.classList.remove('interdimensional-control-is-active');

      trigger('kick');
    },

    /**
     * Toggles the spatial scrolling
     * @public
     */
    toggle: function() {
      isOn ? Interdimensional.kick() : Interdimensional.jump();
    },

    /**
     * Destroys
     * @public
     */
    discharge: function() {
      if (!isCharged) {
        return;
      }

      Interdimensional.kick();

      isCharged = false;
      !settings.control && settings.useControl && document.body.removeChild(control);

      // Remove event listeners
      control.removeEventListener('touchstart', handleTouchStartEvent, false);
      window.removeEventListener('deviceorientation', handleDeviceOrientationEvent, false);
      window.removeEventListener('orientationchange', handleOrientationChangeEvent, false);

      trigger('discharge');
    }
  };
});
