describe('Interdimensional', function() {
  it('should exist', function() {
    expect(Interdimensional).to.exist;
  });

  beforeEach(function(done) {
    Emulator.emulate();

    document.addEventListener('interdimensional:charge', function handleCharge() {
      document.removeEventListener('interdimensional:charge', handleCharge, false);
      done();
    }, false);

    Interdimensional.charge();
  });

  afterEach(function() {
    Emulator.restore();
    Interdimensional.discharge();
  });

  describe('.charge(options)', function() {
    beforeEach(function() {
      Emulator.restore();
      Interdimensional.discharge();
    });

    describe('when some necessary features are unsupported by a browser', function() {
      it('should be failed', function(done) {
        document.addEventListener('interdimensional:fail', function handleFail() {
          document.removeEventListener('interdimensional:fail', handleFail, false);
          done();
        }, false);

        Interdimensional.charge();
      });
    });

    describe('when all necessary features are supported by a browser', function() {
      beforeEach(function() {
        Emulator.emulate();
      });

      it('should be charged', function(done) {
        document.addEventListener('interdimensional:charge', function handleCharge() {
          document.removeEventListener('interdimensional:charge', handleCharge, false);
          expect(document.querySelector('.interdimensional-control')).not.to.be.null;
          done();
        }, false);

        Interdimensional.charge();
      });

      it('should be charged with settings', function(done) {
        document.addEventListener('interdimensional:charge', function handleCharge() {
          document.removeEventListener('interdimensional:charge', handleCharge, false);
          expect(document.querySelector('.interdimensional-control')).to.be.null;
          done();
        }, false);

        Interdimensional.charge({
          useControl: false
        });
      });
    });
  });

  describe('.jump()', function() {
    var scrollTop = 0;
    var scrollLeft = 0;

    beforeEach(function() {
      sinon.stub(window, 'scrollBy', function(x, y) {
        scrollTop += x;
        scrollLeft += y;
      });
    });

    afterEach(function() {
      window.scrollBy.restore();
    });

    it('should jump', function(done) {
      document.addEventListener('interdimensional:jump', function handleJump() {
        document.removeEventListener('interdimensional:jump', handleJump, false);

        expect(
          document
            .querySelector('.interdimensional-control')
              .classList
                .contains('interdimensional-control-is-active')
        ).to.be.true;

        done();
      }, false);

      Interdimensional.jump();
    });

    it('should scroll the page', function(done) {
      Interdimensional.jump();

      setTimeout(function() {
        Emulator.setTilt(50, 50, 50);
      }, 100);

      setTimeout(function() {
        expect(scrollTop).to.be.above(0);
        expect(scrollLeft).to.be.above(0);
        done();
      }, 300);
    });
  });

  describe('.kick()', function() {
    it('should kick', function(done) {
      document.addEventListener('interdimensional:kick', function handleKick() {
        document.removeEventListener('interdimensional:kick', handleKick, false);

        expect(
          document
            .querySelector('.interdimensional-control')
              .classList
                .contains('interdimensional-control-is-active')
        ).to.be.false;

        done();
      }, false);

      Interdimensional.jump();
      Interdimensional.kick();
    });
  });

  describe('.toggle()', function() {
    it('should toggle', function(done) {
      document.addEventListener('interdimensional:jump', function handleJump() {
        document.removeEventListener('interdimensional:jump', handleJump, false);

        document.addEventListener('interdimensional:kick', function handleKick() {
          document.removeEventListener('interdimensional:kick', handleKick, false);
          done();
        }, false);

        Interdimensional.toggle();
      }, false);

      Interdimensional.toggle();
    });
  });

  describe('.discharge()', function() {
    it('should be discharged', function(done) {
      document.addEventListener('interdimensional:discharge', function handleDischarge() {
        document.removeEventListener('interdimensional:discharge', handleDischarge, false);
        expect(document.querySelector('.interdimensional-control')).to.be.null;
        done();
      }, false);

      Interdimensional.discharge();
    });
  });

  describe('.isCharged()', function() {
    it('should return true if Interdimensional is charged', function() {
      expect(Interdimensional.isCharged()).to.be.true;
    });

    it('should return false if Interdimensional is discharged', function() {
      Interdimensional.discharge();
      expect(Interdimensional.isCharged()).to.be.false;
    });
  });

  describe('.isOn()', function() {
    it('should return true if Interdimensional is active', function() {
      Interdimensional.jump();
      expect(Interdimensional.isOn()).to.be.true;
    });

    it('should return false if Interdimensional is inactive', function() {
      Interdimensional.kick();
      expect(Interdimensional.isOn()).to.be.false;
    });
  });
});
