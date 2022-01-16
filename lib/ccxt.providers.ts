import { CcxtModuleOptions } from './interfaces/ccxt-module-options.interface';
import { CCXT_MODULE_OPTIONS } from './ccxt.constants';

export function createCcxtProvider(options: CcxtModuleOptions): any[] {
  return [{ provide: CCXT_MODULE_OPTIONS, useValue: options || {} }];
}
