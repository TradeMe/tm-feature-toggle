import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FeatureToggleModule } from 'tm-feature-toggle';

import { LazyLoadedComponent } from './lazy-loaded.component';

@NgModule({
    declarations: [
        LazyLoadedComponent
    ],
    bootstrap: [
        LazyLoadedComponent
    ],
    imports: [
        CommonModule,
        FeatureToggleModule,
        FeatureToggleModule.forFeature([{
            // path: '__feature__4',
            name: 'myFeature2',
            variant: '4',
            loadChildren: './lazy-4/lazy-loaded.module#LazyLoadedModule'
        }, {
            // path: '__feature__5',
            name: 'myFeature2',
            variant: '5',
            loadChildren: './lazy-5/lazy-loaded.module#LazyLoadedModule'
        }]),
        RouterModule.forChild([{
            path: '',
            component: LazyLoadedComponent,
            children: [{
                path: 'routed-4',
                loadChildren: './lazy-4/lazy-loaded.module#LazyLoadedModule'
            }, {
                path: 'routed-5',
                loadChildren: './lazy-5/lazy-loaded.module#LazyLoadedModule'
            }]
        }])
    ]
})
export class LazyLoadedModule { }
