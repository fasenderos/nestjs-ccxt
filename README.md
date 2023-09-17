<p align="center">
    <img align="center" src="https://user-images.githubusercontent.com/1219087/149739821-09d2c8cb-3a4d-4877-adb7-cbc1118a62d3.png" alt="nestjs-ccxt logo" title="nestjs-ccxt" height="80" />
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/nestjs-ccxt" target="_blank"><img src="https://img.shields.io/npm/v/nestjs-ccxt?color=blue" alt="NPM Version"></a>
    <a href="https://github.com/fasenderos/nestjs-ccxt/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/nestjs-ccxt" alt="Package License"></a>
    <a href="https://www.npmjs.com/package/nestjs-ccxt" target="_blank"><img src="https://img.shields.io/npm/dm/nestjs-ccxt" alt="NPM Downloads"></a>
    <a href="https://circleci.com/gh/fasenderos/nestjs-ccxt" target="_blank"><img src="https://img.shields.io/circleci/build/github/fasenderos/nestjs-ccxt/master" alt="CircleCI" ></a>
    <a href="https://codecov.io/github/fasenderos/nestjs-ccxt" target="_blank"><img src="https://img.shields.io/codecov/c/github/fasenderos/nestjs-ccxt" alt="Codecov"></a>
</p>

# nestjs-ccxt

:star: Star me on GitHub — it motivates me a lot!

[CCXT](https://github.com/ccxt/ccxt) module for [NestJS](https://github.com/nestjs/nest) framework with exchange markets cache for better performance. :rocket::rocket:

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
   * Default: undefined
   */
  defaultExchanges?: ccxt.ExchangeId | ccxt.ExchangeId[];

  /**
   * If `true`, the markets data of the exchanges setted in the `defaultExchanges`
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

## Contributing

I would greatly appreciate any contributions to make this project better. Please make sure to follow the below guidelines before getting your hands dirty.

1. Fork the repository
2. Create your branch (git checkout -b my-branch)
3. Commit any changes to your branch
4. Push your changes to your remote branch
5. Open a pull request

## Donation

If this project help you reduce time to develop, you can give me a cup of coffee 🍵 :)

- USDT (TRC20): `TXArNxsq2Ee8Jvsk45PudVio52Joiq1yEe`
- BTC: `1GYDVSAQNgG7MFhV5bk15XJy3qoE4NFenp`
- BTC (BEP20): `0xf673ee099be8129ec05e2f549d96ebea24ac5d97`
- ETH (ERC20): `0xf673ee099be8129ec05e2f549d96ebea24ac5d97`
- BNB (BEP20): `0xf673ee099be8129ec05e2f549d96ebea24ac5d97`

## License

Copyright [Andrea Fassina](https://github.com/fasenderos), Licensed under [MIT](LICENSE).
