import { DynamicModule, Module } from '@nestjs/common';
import {
  CcxtModuleAsyncOptions,
  CcxtModuleOptions,
} from './interfaces/ccxt-module-options.interface';
import { createAsyncProviders, createCcxtProvider } from './ccxt.providers';
import { CcxtService } from './ccxt.service';

@Module({
  providers: [CcxtService],
  exports: [CcxtService],
})
export class CcxtModule {
  static forRoot(options?: CcxtModuleOptions): DynamicModule {
    const provider = createCcxtProvider(options);
    return {
      module: CcxtModule,
      providers: [provider],
    };
  }

  static forRootAsync(options?: CcxtModuleAsyncOptions): DynamicModule {
    return {
      module: CcxtModule,
      imports: options.imports || [],
      providers: createAsyncProviders(options),
    };
  }
}
