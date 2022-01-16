import { defaultCcxtModuleOptions } from './default-options';
import { createCcxtProvider } from './ccxt.providers';
import { CCXT_MODULE_OPTIONS } from './ccxt.constants';

describe('createOptionsProvider', () => {
  test('should work correctly', () => {
    expect(createCcxtProvider({})).toEqual([
      {
        provide: CCXT_MODULE_OPTIONS,
        useValue: { ...defaultCcxtModuleOptions },
      },
    ]);
  });
});
