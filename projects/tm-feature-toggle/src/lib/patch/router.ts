// Angular:
import { NgModuleRef, Injector } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Dependencies:
import { featuresToRoutes } from '../feature';

export function patchRouter (): void {
    try {
        patchProperty<PatchedConfigLoader, Router>(Router.prototype, 'configLoader', (configLoader) => {
            patchMethod(configLoader.constructor.prototype, 'load', original => {
                return function (...args): Observable<PatchedLoadedRouterConfig> {
                    return original.apply(this, args).pipe(
                        map((config: PatchedLoadedRouterConfig) => {
                            config.routes = featuresToRoutes(config.routes);
                            return config;
                        })
                    );
                };
            });
            return configLoader;
        });

        patchMethod(Router.prototype, 'resetConfig', original => {
            return function (configs: Array<Route>, ...rest: Array<any>): void {
                const routes = featuresToRoutes(configs);
                return original.apply(this, [routes, ...rest]);
            };
        });
    } catch (e) {
        throw new Error('Could not patch router. Private @angular/router APIs may have changed.');
    }
}

function patchMethod <T, K extends keyof T> (object: T, property: K, patch: (value: T[K]) => T[K]): void {
    object[property] = patch(object[property]);
}

function patchProperty <T, U> (object: U, property: string, patch: (value: T) => T): void {
    let patched;
    Object.defineProperty(object, property, {
        set (value) {
            patched = patch(value);
        },
        get () {
            return patched;
        }
    });
}

export type PatchedGlobal = Partial<(typeof window | typeof global)> & {
    PATCH_ROUTER?: false;
};

export interface PatchedLoadedRouterConfig {
    module: NgModuleRef<any>;
    routes: Array<Route>;
}

export interface PatchedConfigLoader {
    load: (injector: Injector, route: Route) => Observable<PatchedLoadedRouterConfig>;
}

export interface PatchedRouter {
    config: Array<Route>;
    configLoader: PatchedConfigLoader;
}

export interface PatchedRoute {
    _loadedConfig: PatchedLoadedRouterConfig;
}
