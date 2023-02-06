import ParameterValidator from '../../../functions/helpers/parameter-validator.private';

const functionPath = 'mockFunctionPath';

test('parameterValidator returns success with strings', async () => {
  const requiredKeys = ['key1', 'key2'];

  const parameters = {
    key1: 'mockValue1',
    key2: 'mockValue2',
  };

  const response = ParameterValidator.validate(functionPath, parameters, requiredKeys);
  expect(response).toBe('');
});

test('parameterValidator returns success with object', async () => {
  const requiredKeys = [
    { key: 'key1', purpose: 'mock purpose string' },
    { key: 'key2', purpose: 'mock purpose string' },
  ];

  const parameters = {
    key1: 'mockValue1',
    key2: 'mockValue2',
  };

  const response = ParameterValidator.validate(functionPath, parameters, requiredKeys);
  expect(response).toBe('');
});

test('parameterValidator returns error with strings', async () => {
  const requiredKeys = ['key1', 'key2'];

  const parameters = {
    key1: 'mockValue1',
  };

  const response = ParameterValidator.validate(functionPath, parameters, requiredKeys);
  expect(response).toBe(`(${functionPath}) Missing key2`);
});

test('parameterValidator returns error with object', async () => {
  const requiredKeys = [
    { key: 'key1', purpose: 'mock purpose string' },
    { key: 'key2', purpose: 'mock purpose string' },
  ];

  const parameters = {
    key1: 'mockValue1',
  };

  const response = ParameterValidator.validate(functionPath, parameters, requiredKeys);
  expect(response).toBe(`(${functionPath}) Missing key2: mock purpose string`);
});

test('parameterValidator returns error with numerical keys', async () => {
  const requiredKeys = [1];

  const parameters = {
    key1: 'mockValue1',
  };

  const response = ParameterValidator.validate(functionPath, parameters, requiredKeys);
  expect(response).toBe(`Invalid data provided to Parameter Validator function`);
});
