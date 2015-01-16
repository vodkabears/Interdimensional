describe('Interdimensional', function() {
  it('should be', function() {
    expect(Interdimensional).toBeDefined();
  });

  describe('#charge', function() {
    describe('when some necessary features are unsupported by a browser', function() {
      var isFailed = false;

      beforeEach(function(done) {
        document.addEventListener('interdimensional:fail', function handleFail() {
          isFailed = true;
          document.removeEventListener('interdimensional:fail', handleFail, false);

          done();
        }, false);

        Interdimensional.charge();
      });

      afterEach(function() {
        Interdimensional.discharge();
      });

      it('should be failed', function() {
        expect(isFailed).toBe(true);
      });
    });

    describe('when all necessary features are supported by a browser', function() {
      var isCharged = false;

      beforeEach(function(done) {
        Emulator.emulate();

        document.addEventListener('interdimensional:charge', function handleCharge() {
          isCharged = true;
          document.removeEventListener('interdimensional:charge', handleCharge, false);

          done();
        }, false);

        Interdimensional.charge();
      });

      afterEach(function() {
        Emulator.restore();
        Interdimensional.discharge();
      });

      it('should be charged', function() {
        expect(isCharged).toBe(true);
        expect(document.querySelector('.interdimensional-control')).not.toBeNull();
      });
    });
  });

  describe('#discharge', function() {
    var isDischarged = false;

    beforeEach(function(done) {
      Emulator.emulate();
      Interdimensional.charge();

      document.addEventListener('interdimensional:charge', function handleCharge() {
        Interdimensional.discharge();
        document.removeEventListener('interdimensional:charge', handleCharge, false);
      }, false);

      document.addEventListener('interdimensional:discharge', function handleDischarge() {
        isDischarged = true;
        document.removeEventListener('interdimensional:discharge', handleDischarge, false);

        done();
      }, false);
    });

    afterEach(function() {
      Emulator.restore();
    });

    it('should be discharged', function() {
      expect(isDischarged).toBe(true);
      expect(document.querySelector('.interdimensional-control')).toBeNull();
    });
  });
});
