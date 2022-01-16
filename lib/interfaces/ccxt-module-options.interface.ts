import { ModuleMetadata, Type } from '@nestjs/common';
import * as ccxt from 'ccxt';

export type CcxtModuleOptions = {
  /**
   * Optional parameters for the underlying Ccxt instance
   * @see https://docs.ccxt.com/en/latest/manual.html#instantiation
   */
  ccxtOptions?: Partial<ccxt.Exchange>;

  /**
   * Default exchanges to be loaded on start up
   * Default: undefined
   */
  defaultExchanges?: ccxt.ExchangeId | ccxt.ExchangeId[];

  /**
   * If `true`, the markets data of the exchanges setted in the `defaultExchange`
   * options are loaded on startup
   * Default: true
   */
  loadMarketsOnStartup?: boolean;

  /**
   * Markets data cache expiration. Set this value to 0 (zero)
   * to disable caching markets data
   * Default: 3600000 (1 hour => 60 * 60 * 1000)
   */
  marketsCacheExpireMs?: number;

  /**
   * Enable the Testnet if supported by the underlying exchange
   * Default: false
   */
  sandboxMode?: boolean;

  /**
   * If `true`, ccxt logs every HTTP requests to stdout
   * Default: false
   */
  verbose?: boolean;
};

export interface CcxtOptionsFactory {
  createCcxtOptions(): Promise<CcxtModuleOptions> | CcxtModuleOptions;
}

export interface CcxtModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<CcxtOptionsFactory>;
  useClass?: Type<CcxtOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<CcxtModuleOptions> | CcxtModuleOptions;
  inject?: any[];
}
