// Angular:
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

// Dependencies:
import { FeatureToggleDirective } from './feature-toggle.directive';
import { Feature } from './feature';
import { Flags, FLAGS } from './flags';

@NgModule({
    declarations: [
        FeatureToggleDirective
    ],
    exports: [
        FeatureToggleDirective
    ]
})
export class FeatureToggleModule {
    public static forRoot (flags?: Flags): ModuleWithProviders {
        return {
            ngModule: FeatureToggleModule,
            providers: [
                { provide: FLAGS, useValue: flags }
            ]
        };
    }

    public static forFeature (features: Array<Feature>): ModuleWithProviders {
        return RouterModule.forChild(features as Array<any>);
    }
}
