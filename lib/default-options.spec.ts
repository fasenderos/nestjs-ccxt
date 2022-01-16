import { defaultCcxtModuleOptions } from './default-options';

describe('defaultCcxtModuleOptions', () => {
  test('should validate the defaultCcxtModuleOptions', () => {
    expect(Object.keys(defaultCcxtModuleOptions).length).toBe(5);
    expect(defaultCcxtModuleOptions.ccxtOptions).toBeUndefined();
    expect(defaultCcxtModuleOptions.defaultExchanges).toBe('binance');
    expect(defaultCcxtModuleOptions.loadMarketsOnStartup).toBe(true);
    expect(defaultCcxtModuleOptions.marketsCacheExpireMs).toBe(3600000);
    expect(defaultCcxtModuleOptions.sandboxMode).toBe(false);
    expect(defaultCcxtModuleOptions.verbose).toBe(false);
  });
});
