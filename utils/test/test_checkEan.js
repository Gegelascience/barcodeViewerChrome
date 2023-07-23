describe('test check ean', function () {

    /*beforeEach(function () {
      spyOn(window, 'throwFunction').and.callThrough();
    });*/
  
    it('test isCorrectEan', function () {
      expect(isCorrectEan("12345670")).toBe(true);
    });

    it('test calculateDigitCheck', function () {
        expect(calculateDigitCheck("1234567")).toBe("0");
      });
  

  });