describe('Interdimensional', function() {
  it('should be', function() {
    expect(Interdimensional).toBeDefined();
  });

  describe('#charge', function() {
    describe('when some necessary features are unsupported by a browser', function() {
      var isFailed = false;
      var handler;

      beforeEach(function(done) {
        handler = function() {
          isFailed = true;
          done();
        };

        document.addEventListener('interdimensional:fail', handler, false);
        Interdimensional.charge();
      });

      afterEach(function() {
        document.removeEventListener('interdimensional:fail', handler, false);
        Interdimensional.discharge();
      });

      it('should be failed', function() {
        expect(isFailed).toBe(true);
      });
    });

    describe('when all necessary features are supported by a browser', function() {
      var isCharged = false;
      var handler;

      beforeEach(function(done) {
        handler = function() {
          isCharged = true;
          done();
        };

        Emulator.emulate();

        document.addEventListener('interdimensional:charge', handler, false);
        Interdimensional.charge();

        Emulator.trigger('deviceorientation');
      });

      afterEach(function() {
        Emulator.restore();
        document.removeEventListener('interdimensional:charge', handler, false);
        Interdimensional.discharge();
      });

      it('should be charged', function() {
        expect(isCharged).toBe(true);
        expect(document.querySelector('.interdimensional-control')).not.toBeNull();
      });
    });
  });
});
