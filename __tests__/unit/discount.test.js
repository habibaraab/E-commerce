const { showDiscount, calculateNewPrice, getDiscountAmount } = require('../../helpers/discount');

describe('showDiscount', () => {
  test('should return true when discount is greater than 0', () => {
    expect(showDiscount(10)).toBe(true);
  });

  test('should return false when discount is 0', () => {
    expect(showDiscount(0)).toBe(false);
  });

  test('should return false when discount is negative', () => {
    expect(showDiscount(-5)).toBe(false);
  });


});

describe('calculateNewPrice', () => {
  test('should return "90.00" when price is 100 and discount is 10', () => {
    expect(calculateNewPrice(100, 10)).toBe("90.00");
  });

  test('should return "0.00" when price is 0', () => {
    expect(calculateNewPrice(0, 50)).toBe("0.00");
  });

  test('should return "100.00" when discount is 0', () => {
    expect(calculateNewPrice(100, 0)).toBe("100.00");
  });
});

describe('calculateNewPrice with negative price', () => {
  
  test('should return "0.00" when price is negative', () => {
    expect(() => getDiscountAmount(-100, 10)).toThrowErrorMatchingSnapshot();
  });

  test('should return 0 when price is 0 regardless of discount', () => {
      expect(getDiscountAmount(0, 50)).toBe(0);
    });
});
