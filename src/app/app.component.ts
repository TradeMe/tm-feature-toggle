import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    public load: boolean;

    public ngOnInit () {
        setTimeout(() => {
            this.load = true;
        }, 3000);
    }
}
