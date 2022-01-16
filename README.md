<p align="center" dir="auto">
    <img align="center" src="https://user-images.githubusercontent.com/1219087/149666571-e312eef2-3215-480f-9c7c-1c1278d17a71.PNG" alt="nestjs-ccxt logo" title="nestjs-ccxt" height="80" />
</p>

# nestjs-ccxt

:star: Star me on GitHub — it motivates me a lot!

[CCXT](https://github.com/ccxt/ccxt) module for [Nest](https://github.com/nestjs/nest) framework with exchange markets cache for better performance. :rocket::rocket:

## Installation

```bash
$ npm i --save nestjs-ccxt ccxt
```

## Getting started

Firstly import `CcxtModule` with `CcxtModule.forRoot(...)` or `CcxtModule.forRootAsync(...)`. Check out the module [configuration options](#configuration)

```ts
import { CcxtModule } from 'nestjs-ccxt';

@Module({
  imports: [CcxtModule.forRoot({ ... })],
})
export class AppModule {}
```

Next, inject `CcxtService` using normal constructor injection.

```ts
@Injectable()
export class ExchangeService {
  constructor(private ccxtService: CcxtService) {}

  async getMarkets() {
    const client = await this.ccxtService.getClient('binance');
    return client.markets;
  }
}
```

## Configuration

`nestjs-ccxt` can be configured with a variety of options. To configure the underlying Ccxt instance, pass an optional `ccxtOptions` object to the `forRoot()` method of `CcxtModule` when importing it. This options object will be passed directly to the underlying Ccxt constructor.

```ts
interface Params {
  /**
   * Optional parameters for the underlying Ccxt instance
   * @see https://docs.ccxt.com/en/latest/manual.html#instantiation
   */
  ccxtOptions?: Partial<ccxt.Exchange>;

  /**
   * Default exchanges to be loaded on start up
   * Default: binance
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
}
```

An optional options object can be passed in the `getClient()` method of `CcxtService`. This options object will be passed directly to the underlying Ccxt constructor.

```ts
const client = await this.ccxtService.getClient('binance', {
  apiKey: 'YOUR_API_KEY',
  secret: 'YOUR_SECRET',
});
```

## License

nestjs-ccxt is [MIT licensed](LICENSE).
