import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LazyLoadedComponent } from './lazy-loaded.component';

@NgModule({
    declarations: [
        LazyLoadedComponent
    ],
    bootstrap: [
        LazyLoadedComponent
    ],
    imports: [
        RouterModule.forChild([{
            path: '',
            component: LazyLoadedComponent
        }])
    ]
})
export class LazyLoadedModule { }
