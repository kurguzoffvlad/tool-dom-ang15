import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common'

import { DomClass } from './source/dom-class';
import { DomElement } from './source/dom-element';
import { DomStyle } from './source/dom-style';

export interface DomTools {
    elt: DomElement;
    cls: DomClass;
    style: DomStyle;
}

export function createDomTools(document: Document): DomTools {
    return {
        elt: new DomElement(document),
        cls: new DomClass(document),
        style: new DomStyle(),
    };
}

@Injectable({providedIn: 'root'})
export class DomToolsService {
    readonly elt: DomElement;
    readonly cls: DomClass;
    readonly style: DomStyle;

    constructor(@Inject(DOCUMENT) document: Document) {
        const t = createDomTools(document);
        this.elt = t.elt;
        this.cls = t.cls;
        this.style = t.style;
    }
}
