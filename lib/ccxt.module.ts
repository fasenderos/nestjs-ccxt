import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  CcxtModuleAsyncOptions,
  CcxtModuleOptions,
  CcxtOptionsFactory,
} from './interfaces/ccxt-module-options.interface';
import { CCXT_MODULE_OPTIONS } from './ccxt.constants';
import { createCcxtProvider } from './ccxt.providers';
import { CcxtService } from './ccxt.service';

@Module({
  providers: [CcxtService],
  exports: [CcxtService],
})
export class CcxtModule {
  static forRoot(options?: CcxtModuleOptions): DynamicModule {
    return {
      module: CcxtModule,
      providers: createCcxtProvider(options),
    };
  }

  static forRootAsync(options?: CcxtModuleAsyncOptions): DynamicModule {
    return {
      module: CcxtModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    };
  }

  private static createAsyncProviders(
    options: CcxtModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
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
      useFactory: async (optionsFactory: CcxtOptionsFactory) =>
        await optionsFactory.createCcxtOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
