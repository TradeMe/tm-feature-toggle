// Angular:
import { LoadChildrenCallback, Route } from '@angular/router';

// Constants:
export const FEATURE_PATH = '__feature__';

export interface Feature {
    path?: string;
    name: string;
    variant?: string;
    loadChildren: LoadChildrenCallback;
}

export function isFeature (config: Route | Feature): config is Feature {
    const maybeFeature = config as Feature;
    return !!(maybeFeature.loadChildren && (maybeFeature.name || maybeFeature.variant));
}

export function featuresToRoutes (configs: Array<Route>): Array<Route> {
    return configs.map(config => {
        if (isFeature(config)) {
            return { ...config, path: getPath() };
        }
        return config;
    });
}

let featureId = 0;
function getPath () {
    return `${FEATURE_PATH}${++featureId}`;
}
