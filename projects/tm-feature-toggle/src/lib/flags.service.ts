// Angular:
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, of } from 'rxjs';

// Dependencies:
import { Flags, FLAGS } from './flags';

@Injectable({
    providedIn: 'root'
})
export class FlagsService {
    constructor (
        @Optional() @Inject(FLAGS) private _flags: Flags
    ) { }

    public getFlags (): Observable<Flags> {
        return of(this._flags || {});
    }
}
