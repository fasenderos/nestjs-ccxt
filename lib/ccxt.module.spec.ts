import { CcxtModuleAsyncOptions } from './interfaces';
import { CcxtModule } from '.';
import { MulterModule } from '@nestjs/platform-express';

describe('CcxtModule', () => {
  describe('forRoot', () => {
    test('should work correctly', () => {
      const module = CcxtModule.forRoot();
      expect(module.module).toBe(CcxtModule);
      expect(module.providers?.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('forRootAsync', () => {
    test('should work correctly', () => {
      const options: CcxtModuleAsyncOptions = {
        useFactory: () => ({}),
        inject: [],
      };
      const module = CcxtModule.forRootAsync(options);
      expect(module.module).toBe(CcxtModule);
      expect(module.imports?.length).toBe(0);
      expect(module.providers?.length).toBeGreaterThanOrEqual(1);
    });

    test('should work correctly with options', () => {
      const options: CcxtModuleAsyncOptions = {
        imports: [MulterModule],
        useFactory: () => ({}),
        inject: [],
      };
      const module = CcxtModule.forRootAsync(options);
      expect(module.module).toBe(CcxtModule);
      expect(module.imports?.length).toBe(1);
      expect(module.imports[0]).toBe(MulterModule);
      expect(module.providers?.length).toBeGreaterThanOrEqual(1);
    });
  });
});
