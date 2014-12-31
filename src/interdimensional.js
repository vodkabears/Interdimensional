!(function(window, document) {
  'use strict';

  function Interdimensional() {}

  Interdimensional.prototype.charge = function() {
    var idim = this;

    idim.control = document.createElement('div');
    idim.control.className = 'interdimensional-control';
    document.body.appendChild(idim.control);

    // Set a starting position
    idim.control.style.position = 'fixed';
    idim.control.style.top = '100%';
    idim.control.style.right = 0;
    idim.control.style.bottom = 0;
    idim.control.style.left = '50%';
    idim.control.style.margin = 0;
    idim.control.style.marginTop = -idim.control.offsetHeight / 2 + 'px';
    idim.control.style.marginLeft = -idim.control.offsetWidth / 2 + 'px';

    idim.control.addEventListener('touchmove', function(e) {
      var touch = e.changedTouches[0];

      e.preventDefault();

      idim.control.style.top = touch.clientY + 'px';
      idim.control.style.left = touch.clientX + 'px';
    }, false);

    return this;
  };

  Interdimensional.prototype.jump = function() {
    return this;
  };

  Interdimensional.prototype.kick = function() {
    return this;
  };

  Interdimensional.prototype.discharge = function() {
    return this;
  };

  window.Interdimensional = window.Interdimensional || new Interdimensional();
})(window, document);
