import { CcxtModuleOptions } from './interfaces/ccxt-module-options.interface';

export const defaultCcxtModuleOptions: CcxtModuleOptions = {
  loadMarketsOnStartup: true,
  marketsCacheExpireMs: 3600000,
  sandboxMode: false,
  verbose: false,
};
