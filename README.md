# tm-feature-toggle

[![npm version](https://img.shields.io/npm/v/tm-feature-toggle.svg)](https://img.shields.io/npm/v/tm-feature-toggle.svg)

`tm-feature-toggle` is a super experimental proof-of-concept for enabling AoT-friendly, lazy-loadedable components. It is primarily for the purposes of feature toggling and AB testing, but has the secondary benefit of enabling more granular bundle splitting. It also provides helpers for enabling route-based feature toggles. It attempts to provide a nice API for configuring features and whether or not a user can access them, *given the currently available APIs within Angular*. Some of those APIs are *private* and *internal*, so this module should be used with an appropriate level of discomfort.

___

## Installation

```sh
npm install tm-feature-toggle --save
```

___

## Hacks

Before you try anything, you need to decide if you want to enable the sweet hacks on @angular/router that make all this possible. It can still work without the hacks, but the API is a little bit worse. 

### Enabling hacks

To enable the hacks, do the following somewhere near the entry point of your application:

```typescript
import { patchRouter } from 'tm-feature-toggle';

patchRouter();

@NgModule({
    // ... as uaual
})
export class AppModule { }
```

### Disabling hacks

If you chose to not call **`patchRouter()`**, then you will need to manually configure route paths for each of your lazy-loaded feature modules. See the "Defining features" section of this README for more details.

### How it works

To see more details about the hacks that enable this functionality, check out `'./lib/patch/router.ts'`.

___

## API

### Defining features

#### `FeatureToggleModule.forFeature(features: Array<Feature>)`

The **`forFeature()`** method is used to declare list of feature variants which can be enabled or disabled for different users.

A **`Feature`** has the following signature:

```typescript
interface Feature {
    path?: string; // REQUIRED if you *do not* run `patchRouter`. This path *must* be unique.
    name: string;
    loadChildren: string;
    variant?: string;
}
```

* `name` should be a unique name for the feature.

* `loadChildren` should be a path to the module that should be lazy-loaded. It follows the same pattern as `RouterModule.forChild` from `@angular/router`, e.g. `./path/to/my/module.module#MyModule`. The root component of the feature should be added as the `bootstrap` component of the module.

* `variant` should an optional identifier for a different version of the same feature. This is useful for when you want to do more than just enable or disable a feature. Using `variant` allows you to test multiple different versions of a feature.

Adding a feature with **two** variants looks something like this:

```typescript
import { FeatureToggleModule } from 'tm-feature-toggle';

@NgModule({
    // ...
    imports: [
        FeatureToggleModule.forFeature([{
            path: '__feature__1', // A unique path is required if you *do not* run `patchRouter()`. Can be omitted otherwise.
            name: 'feature1',
            variant: '1',
            loadChildren: './lazy-1/lazy-loaded.module#LazyLoadedModule'
        }, {
            path: '__feature__2', // A unique path is required if you *do not* run `patchRouter()`. Can be omitted otherwise.
            name: 'feature1',
            variant: '2',
            loadChildren: './lazy-2/lazy-loaded.module#LazyLoadedModule'
        }]
    ],
    // ...
})
export class AppModule { }
```

**`FeatureToggleModule.forFeature()`** can be used from other lazy-loaded modules, so any variant of a feature can contain their own feature toggle definitions.

___

### Configuring feature flags

A **`Feature`** can is enabled via the **`Flags`** object. It should be an object where each `key` is either the name of a feature (for component-based toggles), or a router path to a feature (for route-based toggles). If the value is `fasle`, the feature will be disabled. If the value is not *exactly* `false`, the feature will be enabled. This means that a feature will default to on until a flag with a matching name is specified. While this is a bit counter-intuitive, it keeps the behaviour consistent between component-based and route-based features.

The value can be set to be a `string` to enable a matching variant of the feature.

#### `FeatureToggleModule.forRoot(flags?: Flags)`

The most basic way to provide the configuration flags to your application is to use the **`forRoot()`** method.

```typescript
import { FeatureToggleModule } from 'tm-feature-toggle';

@NgModule({
    // ...
    imports: [
        FeatureToggleModule.forRoot({
            feature1: '1',
            feature2: '4',
            'routed-feature-2': false
        })
    ],
    // ...
})
export class AppModule { }
```

This can be useful for testing out feature toggles, but it is unlikely that you want to hardcode your feature configuration like this. It is more likely that you will want to provide your own `FlagsService` implementation.

#### `FlagsService`

```typescript
export class FlagsService {
    public getFlags (): Observable<Flags> {
}
```

The default **`FlagsService`** consumes the statically defined configuration from the **`forRoot()`** method. You probably want to override this in your `AppModule`.

```typescript
import { FeatureToggleModule, FlagsService } from 'tm-feature-toggle';

@NgModule({
    // ...
    imports: [
        FeatureToggleModule.forRoot()
    ],
    provides: [
        { provide: FlagsService, useClass: MyFlagsService }
    ]
    // ...
})
export class AppModule { }
```

A custom implementation can then request the feature configuration asynchronously on a per-user basis, and rearrange that into a set of **`Flags`**.

### Consuming features

#### `FeatureToggleDirective`

The `[tmFeatureToggle]` directive is used to activate a feature within your application. You'll need to provide the `FeatureToggleModule` to use it.

```typescript
import { FeatureToggleModule } from 'tm-feature-toggle';

@NgModule({
    // ...
    imports: [
        FeatureToggleModule
    ],
    // ...
})
export class MyComponentModule { }
```

Then you can use it in your component:

```html
<ng-container
    tmFeatureToggle="feature1">
</ng-container>
```

This can of course be combined with `*ngIf` to enable components based on application state (rather than user state):

```html
<ng-container
    *ngIf="isAprilFoolsDay"
    tmFeatureToggle="sweetJoke">
</ng-container>
```

### `CanUseFeatureGuard`

You can also use the **`CanUseFeatureGuard`** to easily enable or disable route-based features.

```typescript
import { CanUseFeatureGuard } from 'tm-feature-toggle';

@NgModule({
    // ...
    imports: [
        RouterModule.forChild([{
            path: 'routed-feature',
            loadChildren: './path/to/my/feature.module#FeatureModule',
            canActivate: [CanUseFeatureGuard]
        }])
    ],
    // ...
})
export class AppModule { }
```

It can be used with either `**canAdctivate` or `canActivateChild`.

___

## 🎉🎉🎉🎉🎉