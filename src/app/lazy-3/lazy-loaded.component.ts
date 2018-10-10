import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './lazy-loaded.component.html'
})
export class LazyLoadedComponent implements OnInit {
    public load: boolean;

    public ngOnInit () {
        setTimeout(() => {
            this.load = true;
        }, 3000);
    }
}
