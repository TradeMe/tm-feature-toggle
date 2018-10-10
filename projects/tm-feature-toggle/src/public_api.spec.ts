import { patchRouter, CanUseFeatureGuard, FeatureToggleDirective, FeatureToggleModule, FeatureToggleService, FlagsService, FLAGS } from 'tm-feature-toggle';

describe('Public API', () => {
    it('should be stable', () => {
        expect(patchRouter).toBeDefined();
        expect(CanUseFeatureGuard).toBeDefined();
        expect(FeatureToggleDirective).toBeDefined();
        expect(FeatureToggleModule).toBeDefined();
        expect(FeatureToggleService).toBeDefined();
        expect(FlagsService).toBeDefined();
        expect(FLAGS).toBeDefined();
    });
});
