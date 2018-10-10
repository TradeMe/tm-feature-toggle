// Angular:
import { InjectionToken } from '@angular/core';

export type Flags = Record<string, boolean | string>;

export const FLAGS = new InjectionToken('FLAGS');
