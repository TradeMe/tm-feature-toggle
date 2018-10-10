// Angular:
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// Dependencies:
import { FeatureToggleService } from './feature-toggle.service';

@Injectable({
    providedIn: 'root'
})
export class CanUseFeatureGuard implements CanActivate, CanActivateChild {
    constructor (
        private _featureToggleService: FeatureToggleService
    ) { }

    public canActivate (route: ActivatedRouteSnapshot): Observable<boolean> {
        return this._featureToggleService.canUseFeature(route.routeConfig.path);
    }

    public canActivateChild (route: ActivatedRouteSnapshot): Observable<boolean> {
        return this._featureToggleService.canUseFeature(route.routeConfig.path);
    }
}
