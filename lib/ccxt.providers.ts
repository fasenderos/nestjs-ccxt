import { CcxtModuleOptions } from './interfaces/ccxt-module-options.interface';
import { CCXT_MODULE_OPTIONS } from './ccxt.constants';
import { defaultCcxtModuleOptions } from './default-options';

export function createCcxtProvider(options: CcxtModuleOptions): any[] {
  return [
    {
      provide: CCXT_MODULE_OPTIONS,
      useValue: { ...defaultCcxtModuleOptions, ...options },
    },
  ];
}
