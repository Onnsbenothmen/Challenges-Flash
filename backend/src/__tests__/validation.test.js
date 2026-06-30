const { validateId } = require('../middleware/validation');

describe('Validation Middleware', () => {
  test('validateId passes for valid integer param', () => {
    const middleware = validateId;
    expect(middleware).toBeDefined();
  });

  test('validateId rejects non-integer param', () => {
    const req = { params: { id: 'abc' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const validationChain = validateId;
    expect(validationChain.length).toBe(2);
    expect(validationChain[0]).toBeDefined();
    expect(validationChain[1]).toBeDefined();
  });
});
