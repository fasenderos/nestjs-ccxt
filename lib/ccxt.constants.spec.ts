import * as constants from './ccxt.constants';

test('each of constants should be defined', () => {
  Object.values(constants).forEach(value => expect(value).toBeDefined());
});
