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
        window.Event.prototype.alpha = 0;
        window.Event.prototype.beta = 1;
        window.Event.prototype.gamma = 0;
        window.ontouchstart = null;

        eventsInterval && clearInterval(eventsInterval);
        eventsInterval = setInterval(function() {
          Emulator.trigger('deviceorientation');
        }, 100);
      },

      /**
       * Turns off the emulation
       */
      restore: function() {
        window.DeviceOrientationEvent = ORIGINAL.DeviceOrientationEvent;
        window.Event = ORIGINAL.Event;

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
