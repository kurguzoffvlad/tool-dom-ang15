import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common'

import { DomClass } from './dom-class';
import { DomElement } from './dom-element';
import { DomStyle } from './dom-style';

export interface DomTools {
    elt: DomElement;
    cls: DomClass;
    stl: DomStyle;
}

export function createDomTools(document: Document): DomTools {
    return {
        elt: new DomElement(document),
        cls: new DomClass(document),
        stl: new DomStyle(),
    };
}

@Injectable({providedIn: 'root'})
export class DomToolsService {
    readonly elt: DomElement;
    readonly cls: DomClass;
    readonly stl: DomStyle;

    constructor(@Inject(DOCUMENT) document: Document) {
        const t = createDomTools(document);
        this.elt = t.elt;
        this.cls = t.cls;
        this.stl = t.stl;
    }
}
