// Angular:
import { Directive, Input, OnChanges, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';

// Dependencies:
import { FeatureToggleService } from './feature-toggle.service';

@Directive({
    selector: '[tmFeatureToggle]'
})
export class FeatureToggleDirective implements OnChanges {
    @Input() public tmFeatureToggle: any;

    constructor (
        private _vcr: ViewContainerRef,
        private _featureToggleService: FeatureToggleService
    ) { }

    public ngOnChanges () {
        this._featureToggleService.loadVariant(this.tmFeatureToggle).pipe(
            take(1),
        )
        .subscribe(componentFactory => this._vcr.createComponent(componentFactory));
    }
}
