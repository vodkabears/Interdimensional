/**
 * Test helper for the emulation.
 */
!(function(window, document) {
  'use strict';

  window.Emulator = (function() {

    /**
     * Original objects
     * @private
     * @const
     * @type {Object}
     */
    var ORIGINAL = {
      DeviceOrientationEvent: window.DeviceOrientationEvent,
      Event: window.Event,
      ontouchstart: window.ontouchstart
    };

    /**
     * Id of the spammer
     * @private
     * @type {Number}
     */
    var eventsInterval;

    /**
     * Tilt of the device
     * @private
     * @type {Object}
     */
    var tilt = {
      alpha: 0,
      beta: 0,
      gamma: 0
    };

    return {

      /**
       * Triggers events
       * @param  {String} eventName
       */
      trigger: function(eventName) {
        var event = document.createEvent('Event');

        event.initEvent(eventName, true, true);
        document.dispatchEvent(event);
      },

      /**
       * Turns on the emulation
       */
      emulate: function() {
        window.DeviceOrientationEvent = function() {};
        window.Event.prototype.alpha = tilt.alpha;
        window.Event.prototype.beta = tilt.beta;
        window.Event.prototype.gamma = tilt.gamma;
        window.ontouchstart = null;

        eventsInterval && clearInterval(eventsInterval);
        eventsInterval = setInterval(function() {
          window.Event.prototype.alpha = tilt.alpha;
          window.Event.prototype.beta = tilt.beta;
          window.Event.prototype.gamma = tilt.gamma;
          Emulator.trigger('deviceorientation');
        }, 50);
      },

      /**
       * Set a tilt of the device
       * @param {Number} alpha
       * @param {Number} beta
       * @param {Number} gamma
       */
      setTilt: function(alpha, beta, gamma) {
        tilt.alpha = alpha;
        tilt.beta = beta;
        tilt.gamma = gamma;
      },

      /**
       * Turns off the emulation
       */
      restore: function() {
        window.DeviceOrientationEvent = ORIGINAL.DeviceOrientationEvent;
        window.Event = ORIGINAL.Event;
        tilt.alpha = 0;
        tilt.beta = 0;
        tilt.gamma = 0;

        if (typeof ORIGINAL.ontouchstart === 'undefined') {
          delete window.ontouchstart;
        } else {
          window.ontouchstart = ORIGINAL.ontouchstart;
        }

        clearInterval(eventsInterval);
      }
    };
  })();
})(window, document);
