import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CanUseFeatureGuard, patchRouter, FeatureToggleModule } from 'tm-feature-toggle';

import { AppComponent } from './app.component';

patchRouter();

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FeatureToggleModule.forRoot({
            myFeature: '1',
            myFeature2: '4',
            'routed-1': true,
            'routed-3': true
        }),
        FeatureToggleModule.forFeature([{
            // path: '__feature__1',
            name: 'myFeature',
            variant: '1',
            loadChildren: './lazy-1/lazy-loaded.module#LazyLoadedModule'
        }, {
            // path: '__feature__2',
            name: 'myFeature',
            variant: '2',
            loadChildren: './lazy-2/lazy-loaded.module#LazyLoadedModule'
        }, {
            // path: '__feature__3',
            name: 'myFeature',
            variant: '3',
            loadChildren: './lazy-3/lazy-loaded.module#LazyLoadedModule'
        }]),
        RouterModule.forRoot([]),
        RouterModule.forChild([{
            path: 'routed-1',
            loadChildren: './lazy-1/lazy-loaded.module#LazyLoadedModule'
        }, {
            path: 'routed-2',
            loadChildren: './lazy-2/lazy-loaded.module#LazyLoadedModule'
        }]),
        RouterModule.forChild([{
            path: 'routed-3',
            loadChildren: './lazy-3/lazy-loaded.module#LazyLoadedModule',
            canActivate: [CanUseFeatureGuard]
        }])
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
