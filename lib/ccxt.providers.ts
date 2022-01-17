import {
  CcxtModuleAsyncOptions,
  CcxtModuleOptions,
  CcxtOptionsFactory,
} from './interfaces/ccxt-module-options.interface';
import { CCXT_MODULE_OPTIONS } from './ccxt.constants';
import { defaultCcxtModuleOptions } from './default-options';
import { Provider } from '@nestjs/common';

export function createCcxtProvider(options: CcxtModuleOptions): Provider<any> {
  return {
    provide: CCXT_MODULE_OPTIONS,
    useValue: { ...defaultCcxtModuleOptions, ...options },
  };
}

export function createAsyncProviders(
  options: CcxtModuleAsyncOptions,
): Provider[] {
  if (options.useExisting || options.useFactory) {
    return [createAsyncOptionsProvider(options)];
  }
  return [
    createAsyncOptionsProvider(options),
    {
      provide: options.useClass,
      useClass: options.useClass,
    },
  ];
}

export function createAsyncOptionsProvider(
  options: CcxtModuleAsyncOptions,
): Provider {
  if (options.useFactory) {
    return {
      provide: CCXT_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
  return {
    provide: CCXT_MODULE_OPTIONS,
    useFactory: createAsyncOptions,
    inject: [options.useExisting || options.useClass],
  };
}

export async function createAsyncOptions(
  optionsFactory: CcxtOptionsFactory,
): Promise<CcxtModuleOptions> {
  const options = await optionsFactory.createCcxtOptions();
  return { ...defaultCcxtModuleOptions, ...options };
}
