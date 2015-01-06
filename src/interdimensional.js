!(function(window, document) {
  'use strict';

  var isCharged = false;
  var isOn = false;
  var lastAlpha;
  var lastBeta;
  var control;
  var settings = {
    speed: 200,
    insensitivity: 3
  };

  function calcShift(lastAngle, newAngle) {
    return Math.abs(newAngle - lastAngle) > settings.insensitivity ?
      settings.speed * (newAngle / lastAngle - 1) : 0;
  }

  function handleTouchStartEvent() {
    isOn = true;
    control.classList.add('interdimensional-control-is-active');
  }

  function handleTouchMoveEvent(e) {
    if (!isOn) {
      return;
    }

    var touch = e.changedTouches[0];

    e.preventDefault();

    control.style.top = touch.clientY + 'px';
    control.style.left = touch.clientX + 'px';
  }

  function handleTouchEndEvent() {
    isOn = false;
    control.classList.remove('interdimensional-control-is-active');
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

    // Set a starting position
    control.style.position = 'fixed';
    control.style.top = '100%';
    control.style.right = 0;
    control.style.bottom = 0;
    control.style.left = '50%';
    control.style.margin = 0;
    control.style.marginTop = -control.offsetHeight / 2 + 'px';
    control.style.marginLeft = -control.offsetWidth / 2 + 'px';

    // Add event listeners
    control.addEventListener('touchstart', handleTouchStartEvent, false);
    control.addEventListener('touchmove', handleTouchMoveEvent, false);
    control.addEventListener('touchend', handleTouchEndEvent, false);
    control.addEventListener('touchcancel', handleTouchEndEvent, false);
    window.addEventListener('deviceorientation', handleDeviceOrientationEvent, false);

    return this;
  };

  Interdimensional.jump = function() {
    if (!isCharged) {
      return this;
    }

    return this;
  };

  Interdimensional.kick = function() {
    if (!isCharged) {
      return this;
    }

    return this;
  };

  Interdimensional.discharge = function() {
    if (!isCharged) {
      return this;
    }

    return this;
  };

  window.Interdimensional = Interdimensional;
})(window, document);
