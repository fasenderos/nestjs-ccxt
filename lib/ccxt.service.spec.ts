import * as ccxt from 'ccxt';
import { Test, TestingModule } from '@nestjs/testing';
import { CcxtModuleOptions } from './interfaces/ccxt-module-options.interface';
import { CCXT_MODULE_OPTIONS } from './ccxt.constants';
import { CcxtService } from './ccxt.service';

describe('CcxtService', () => {
  let ccxtService: CcxtService;
  let options: CcxtModuleOptions;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CcxtService,
        {
          provide: CCXT_MODULE_OPTIONS,
          useValue: { collection: jest.fn() },
        },
      ],
    }).compile();

    ccxtService = module.get<CcxtService>(CcxtService);
    options = module.get(CCXT_MODULE_OPTIONS);
    await module.init();
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await module.close();
  });

  it('should be defined', () => {
    expect(ccxtService).toBeDefined();
  });

  it('should return ccxt client', async () => {
    let getExchangeSpy: jest.SpyInstance;
    getExchangeSpy = jest.spyOn(ccxtService as any, 'getExchange');

    let loadExchangeMarketsSpy: jest.SpyInstance;
    loadExchangeMarketsSpy = jest.spyOn(
      ccxtService as any,
      'loadExchangeMarkets',
    );

    const exchangeId = 'binance';
    const options: Partial<ccxt.Exchange> = { verbose: false };
    const client = await ccxtService.getClient(exchangeId, options);

    expect(getExchangeSpy).toBeCalledTimes(1);
    expect(getExchangeSpy).toBeCalledWith(exchangeId, options);

    expect(loadExchangeMarketsSpy).toBeCalledTimes(1);
    expect(loadExchangeMarketsSpy).toBeCalledWith(exchangeId);

    expect(client.id).toBe(exchangeId);
    expect(client.verbose).toBe(options.verbose);
  });
});

describe('CcxtService onModuleInit', () => {
  let ccxtService: CcxtService;
  let options: CcxtModuleOptions;
  let module: TestingModule;

  afterEach(async () => {
    jest.resetAllMocks();
    await module.close();
  });

  it('should not load defualtExchanges', async () => {
    module = await Test.createTestingModule({
      providers: [
        CcxtService,
        {
          provide: CCXT_MODULE_OPTIONS,
          useValue: {
            collection: jest.fn(),
          },
        },
      ],
    }).compile();
    ccxtService = module.get<CcxtService>(CcxtService);

    let loadExchange: jest.SpyInstance;
    loadExchange = jest.spyOn(ccxtService as any, 'loadExchange');
    await ccxtService.onModuleInit();
    expect(loadExchange).toBeCalledTimes(0);
    // @ts-ignore
    expect(ccxtService._clients).toEqual({});
  });

  it('should load one defualtExchanges', async () => {
    const exchangeId = 'binance';
    const ccxtOptions = {
      rateLimit: 10000,
    };
    const verbose = true;
    const loadMarketsOnStartup = false;
    module = await Test.createTestingModule({
      providers: [
        CcxtService,
        {
          provide: CCXT_MODULE_OPTIONS,
          useValue: {
            collection: jest.fn(),
            defaultExchanges: exchangeId,
            sandboxMode: true,
            loadMarketsOnStartup,
            verbose,
            marketsCacheExpireMs: 0,
            ccxtOptions,
          },
        },
      ],
    }).compile();
    ccxtService = module.get<CcxtService>(CcxtService);

    let loadExchange: jest.SpyInstance;
    loadExchange = jest.spyOn(ccxtService as any, 'loadExchange');

    await ccxtService.onModuleInit();
    await ccxtService.getClient(exchangeId, options);
    expect(loadExchange).toBeCalledTimes(1);
    expect(loadExchange).toBeCalledWith(
      exchangeId,
      ccxtOptions,
      loadMarketsOnStartup,
    );
    // @ts-ignore
    expect(ccxtService._clients[exchangeId].rateLimit).toBe(
      ccxtOptions.rateLimit,
    );
    // @ts-ignore
    expect(ccxtService._clients[exchangeId].verbose).toBe(verbose);
  });

  it('should load multiple defualtExchanges', async () => {
    const exchangeId = ['binance', 'ftx'];
    module = await Test.createTestingModule({
      providers: [
        CcxtService,
        {
          provide: CCXT_MODULE_OPTIONS,
          useValue: {
            collection: jest.fn(),
            defaultExchanges: exchangeId,
            verbose: false,
          },
        },
      ],
    }).compile();
    ccxtService = module.get<CcxtService>(CcxtService);

    let loadExchange: jest.SpyInstance;
    loadExchange = jest.spyOn(ccxtService as any, 'loadExchange');

    await ccxtService.onModuleInit();
    expect(loadExchange).toBeCalledTimes(exchangeId.length);
    exchangeId.forEach(id => {
      // @ts-ignore
      expect(ccxtService._clients[id]).toBeDefined();
    });
  });
});
