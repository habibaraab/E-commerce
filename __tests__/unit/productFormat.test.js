const { convertToUppercase } = require('../../helpers/productFormat');

describe('convertToUppercase', () => {
  test('should convert lowercase to uppercase', () => {
    expect(convertToUppercase('hello')).toBe('HELLO');
  });

  test('should keep uppercase unchanged', () => {
    expect(convertToUppercase('WORLD')).toBe('WORLD');
  });

  test('should convert mixed case to uppercase', () => {
    expect(convertToUppercase('HeLLo')).toBe('HELLO');
  });

  test('should return empty string when input is empty', () => {
    expect(convertToUppercase('')).toBe('');
  });
});
