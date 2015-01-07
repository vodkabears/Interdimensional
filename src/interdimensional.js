!(function(window, document) {
  'use strict';

  var isCharged = false;
  var isOn = false;
  var lastAlpha;
  var lastBeta;
  var control;
  var settings = {
    speed: 150,
    insensitivity: 5
  };

  function calcShift(lastAngle, newAngle) {
    var diff = newAngle - lastAngle;
    var absDiff = Math.abs(diff);
    var sign = diff === 0 ? 0 : diff / absDiff;

    return absDiff > settings.insensitivity ?
      settings.speed * ((newAngle - sign * settings.insensitivity) / lastAngle - 1) : 0;
  }

  function handleTouchStartEvent() {
    Interdimensional.toggle();
  }

  function handleDeviceOrientationEvent(e) {
    if (!isOn) {
      lastAlpha = e.alpha;
      lastBeta = e.beta;
    } else {
      window.scrollBy(
        calcShift(lastAlpha, e.alpha),
        calcShift(lastBeta, e.beta)
      );
    }
  }

  function Interdimensional() {}

  Interdimensional.charge = function() {
    if (isCharged) {
      return this;
    }

    isCharged = true;

    control = document.createElement('div');
    control.className = 'interdimensional-control';
    document.body.appendChild(control);

    // Add event listeners
    control.addEventListener('touchstart', handleTouchStartEvent, false);
    window.addEventListener('deviceorientation', handleDeviceOrientationEvent, false);

    return this;
  };

  Interdimensional.jump = function() {
    if (!isCharged) {
      return this;
    }

    isOn = true;
    control.classList.add('interdimensional-control-is-active');

    return this;
  };

  Interdimensional.kick = function() {
    if (!isCharged) {
      return this;
    }

    isOn = false;
    control.classList.remove('interdimensional-control-is-active');

    return this;
  };

  Interdimensional.toggle = function() {
    return isOn ? Interdimensional.kick() : Interdimensional.jump();
  };

  Interdimensional.discharge = function() {
    if (!isCharged) {
      return this;
    }

    return this;
  };

  window.Interdimensional = Interdimensional;
})(window, document);
