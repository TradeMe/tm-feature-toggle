// Angular:
import { ComponentFactory, Injector, Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

// Dependencies:
import { Feature, isFeature,  } from './feature';
import { Flags } from './flags';
import { FlagsService } from './flags.service';
import { PatchedRouter, PatchedRoute } from './patch/router';

@Injectable({
    providedIn: 'root'
})
export class FeatureToggleService {
    private _loading$;

    constructor (
        private _flagsService: FlagsService,
        private _injector: Injector,
        private _router: Router
    ) { }

    public canUseFeature (name: string): Observable<boolean> {
        return this._flagsService.getFlags().pipe(
            map(flags => this._checkCanUseFeature(flags, name))
        );
    }

    public loadVariant (name: string): Observable<ComponentFactory<any>> {
        return (this._loading$ || of(null)).pipe(
            switchMap(() => this._flagsService.getFlags()),
            filter((flags: Flags) => this._checkCanUseFeature(flags, name)),
            map(flags => {
                const variantName = flags[name];
                const variant = this._getFeatures(this._router.config)
                    .filter(feature => feature.name === name)
                    .find(feature => !feature.variant || feature.variant === variantName);

                const hasVariantName = typeof variantName === 'string';
                if (!variant && !hasVariantName) {
                    throw new Error(`Could not find module configuration for variant "${variantName}" of feature "${name}".`);
                }
                if (!variant) {
                    throw new Error(`Could not find module configuration for feature "${name}".`);
                }

                return variant;
            }),
            switchMap(variant => {
                this._loading$ = new Subject();
                return (this._router as any as PatchedRouter).configLoader.load(this._injector, variant);
            }),
            map(({ module }) => {
                this._loading$.complete();
                this._loading$ = null;
                const [bootstrapComponentType] = (module as any)._bootstrapComponents;
                return module.componentFactoryResolver.resolveComponentFactory(bootstrapComponentType);
            })
        );
    }

    private _checkCanUseFeature (flags: Flags, name: string): boolean {
        return flags[name] !== false;
    }

    private _getFeatures (routes: Array<Route>): Array<Feature> {
        return routes.map(route => {
            const lazyRoute = route as PatchedRoute;
            if (lazyRoute._loadedConfig) {
                return this._getFeatures(lazyRoute._loadedConfig.routes);
            }
            return [route as Feature];
        })
        .reduce((p, n) => [...p, ...n], [])
        .filter(isFeature);
    }
}
