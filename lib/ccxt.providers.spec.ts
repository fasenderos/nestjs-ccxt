import { defaultCcxtModuleOptions } from './default-options';
import {
  createAsyncOptions,
  createAsyncOptionsProvider,
  createAsyncProviders,
  createCcxtProvider,
} from './ccxt.providers';
import { CCXT_MODULE_OPTIONS } from './ccxt.constants';
import {
  CcxtModuleAsyncOptions,
  CcxtModuleOptions,
  CcxtOptionsFactory,
} from './interfaces/ccxt-module-options.interface';

class CcxtConfigService implements CcxtOptionsFactory {
  createCcxtOptions(): CcxtModuleOptions {
    return {};
  }
}

const customOption: CcxtModuleOptions = { verbose: true };

describe('createOptionsProvider', () => {
  test('should work correctly', () => {
    expect(createCcxtProvider({})).toEqual({
      provide: CCXT_MODULE_OPTIONS,
      useValue: { ...defaultCcxtModuleOptions },
    });

    expect(createCcxtProvider(customOption)).toEqual({
      provide: CCXT_MODULE_OPTIONS,
      useValue: { ...defaultCcxtModuleOptions, ...customOption },
    });
  });
});

describe('createAsyncProviders', () => {
  test('should create providers with useFactory', () => {
    const result = createAsyncProviders({ useFactory: () => ({}) });
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('provide', CCXT_MODULE_OPTIONS);
    expect(result[0]).toHaveProperty('inject', []);
  });

  test('should create providers with useFactory and injected provider', () => {
    const result = createAsyncProviders({
      useFactory: () => ({}),
      inject: [CcxtConfigService],
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('provide', CCXT_MODULE_OPTIONS);
    expect(result[0]).toHaveProperty('inject', [CcxtConfigService]);
  });

  test('should create providers with useClass', () => {
    const result = createAsyncProviders({ useClass: CcxtConfigService });
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('provide', CCXT_MODULE_OPTIONS);
    expect(result[0]).toHaveProperty('inject', [CcxtConfigService]);
  });

  test('should create providers with useExisting', () => {
    const result = createAsyncProviders({ useExisting: CcxtConfigService });
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('provide', CCXT_MODULE_OPTIONS);
    expect(result[0]).toHaveProperty('inject', [CcxtConfigService]);
  });
});

describe('createAsyncOptions', () => {
  test('should work correctly', async () => {
    const ccxtConfigService: CcxtOptionsFactory = {
      createCcxtOptions() {
        return { verbose: true };
      },
    };
    await expect(createAsyncOptions(ccxtConfigService)).resolves.toEqual({
      ...defaultCcxtModuleOptions,
      verbose: true,
    });
  });
});

describe('createAsyncOptionsProvider', () => {
  test('should create provider with useClass', () => {
    const options: CcxtModuleAsyncOptions = { useClass: CcxtConfigService };
    expect(createAsyncOptionsProvider(options)).toHaveProperty(
      'provide',
      CCXT_MODULE_OPTIONS,
    );
    expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
    expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [
      CcxtConfigService,
    ]);
  });

  test('should create provider with useExisting', () => {
    const options: CcxtModuleAsyncOptions = {
      useExisting: CcxtConfigService,
    };
    expect(createAsyncOptionsProvider(options)).toHaveProperty(
      'provide',
      CCXT_MODULE_OPTIONS,
    );
    expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
    expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [
      CcxtConfigService,
    ]);
  });
});
