import * as ccxt from 'ccxt';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CCXT_MODULE_OPTIONS } from './ccxt.constants';
import { CcxtModuleOptions } from '.';

@Injectable()
export class CcxtService implements OnModuleInit {
  private _clients: Map<ccxt.ExchangeId, ccxt.Exchange> = {} as Map<
    ccxt.ExchangeId,
    ccxt.Exchange
  >;
  private _lastMarketsFetch: Map<ccxt.ExchangeId, number> = {} as Map<
    ccxt.ExchangeId,
    number
  >;

  constructor(
    @Inject(CCXT_MODULE_OPTIONS)
    private readonly options: CcxtModuleOptions,
  ) {}

  async onModuleInit(): Promise<void> {
    // Load default exchanges
    if (this.options?.defaultExchanges) {
      const exchanges = Array.isArray(this.options.defaultExchanges)
        ? this.options.defaultExchanges
        : [this.options.defaultExchanges];
      const { ccxtOptions, loadMarketsOnStartup } = this.options;
      // Load all exchanges on startup
      await Promise.all(
        exchanges.map(exchangeId =>
          this.loadExchange(exchangeId, ccxtOptions, loadMarketsOnStartup),
        ),
      );
    }
  }

  /**
   * Create new ccxt instance and caches it
   * @param {ccxt.ExchangeId} exchangeId The exchange identifier
   * @param {Partial<ccxt.Exchange>} options Any Ccxt options
   * @param {boolean} loadMarkets force reload markets data
   */
  private async loadExchange(
    exchangeId: ccxt.ExchangeId,
    options?: Partial<ccxt.Exchange>,
    loadMarkets?: boolean,
  ) {
    // Save client in cache
    this._clients[exchangeId] = new ccxt[exchangeId]({
      ...this.options?.ccxtOptions,
      ...options,
    });
    // Set Sandbox Mode
    if (this.options?.sandboxMode === true)
      this._clients[exchangeId].setSandboxMode(true);
    // Set verbose log
    if (this.options?.verbose === true)
      this._clients[exchangeId].verbose = true;
    // Load exchange markets
    if (loadMarkets === true) await this.loadExchangeMarkets(exchangeId);
  }

  /**
   * Load exchange markets and store the fetching time for the cache expiration comparison
   * @param exchangeId The exchange identifier
   */
  private async loadExchangeMarkets(exchangeId) {
    // Load markets data
    await this._clients[exchangeId].loadMarkets(true);
    // Save the fetching timestamp (milliseconds)
    this._lastMarketsFetch[exchangeId] = Date.now();
  }

  /**
   *
   * @param {ccxt.ExchangeId} exchangeId The exchange identifier
   * @param {Partial<ccxt.Exchange>} options Any Ccxt options
   * @returns {ccxt.Exchange} Instance of the ccxt client
   */
  private async getExchange(
    exchangeId: ccxt.ExchangeId,
    options: Partial<ccxt.Exchange>,
  ): Promise<ccxt.Exchange> {
    // Check if exchange has been loaded
    if (!this._clients[exchangeId]) {
      await this.loadExchange(exchangeId, options, true);
    }

    if (this.marketsCacheExpired(exchangeId))
      await this.loadExchangeMarkets(exchangeId);

    // Return a new instance to the user and copy all markets data from cache
    const userClient = new ccxt[exchangeId](options);
    [
      'ids',
      'markets',
      'markets_by_id',
      'marketsById',
      'currencies',
      'currencies_by_id',
      'baseCurrencies',
      'quoteCurrencies',
      'symbols',
      'verbose',
    ].forEach(prop => {
      userClient[prop] = this._clients[exchangeId][prop];
    });
    // Set Sandbox Mode
    if (this.options?.sandboxMode === true) userClient.setSandboxMode(true);
    return userClient;
  }

  /**
   * Check if the exchange cache has expired
   * @param {ccxt.ExchangeId} exchangeId Exchange cache identifier
   * @returns {boolean}
   */
  private marketsCacheExpired(exchangeId: ccxt.ExchangeId): boolean {
    const lastFetch: number = this._lastMarketsFetch?.[exchangeId] || 0;
    return Date.now() - lastFetch > this.options.marketsCacheExpireMs;
  }

  /**
   * Get an instance of the ccxt client for the provided exchange
   * @param {ccxt.ExchangeId} exchangeId The exchange identifier
   * @param {Partial<ccxt.Exchange>} options Any Ccxt options passed to the exchange instance
   * @returns {ccxt.Exchange} Instance of the ccxt client
   */
  public getClient(
    exchangeId: ccxt.ExchangeId,
    options?: Partial<ccxt.Exchange>,
  ): Promise<ccxt.Exchange> | ccxt.Exchange {
    return this.getExchange(exchangeId, options);
  }
}
