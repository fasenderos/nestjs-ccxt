import { CcxtModuleAsyncOptions } from './interfaces';
import { CcxtModule } from '.';

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
        imports: [],
        useFactory: () => ({}),
        inject: [],
      };
      const module = CcxtModule.forRootAsync(options);
      expect(module.module).toBe(CcxtModule);
      expect(module.imports?.length).toBe(0);
      expect(module.providers?.length).toBeGreaterThanOrEqual(1);
    });
  });
});
