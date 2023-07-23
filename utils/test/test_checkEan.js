describe('test check ean', function () {

    /*beforeEach(function () {
      spyOn(window, 'throwFunction').and.callThrough();
    });*/
  
    it('test isCorrectEan', function () {
      expect(isCorrectEan("12345670")).toBe(true);
      expect(isCorrectEan("12345678")).toBe(false);
      expect(isCorrectEan("123456780")).toBe(false);
      expect(isCorrectEan("12H45670")).toBe(false);
      expect(isCorrectEan()).toBe(false);
    });

    it('test calculateDigitCheck', function () {
      expect(calculateDigitCheck("1234567")).toBe("0");
      expect(calculateDigitCheck("123456K7")).toBe("KO");
    });

  });