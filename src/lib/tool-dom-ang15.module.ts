import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import { ToolDomAng15RoutingModule } from './tool-dom-ang15-routing.module';
import {ToolDomAng15Component} from './tool-dom-ang15.component';


@NgModule({
    declarations: [ToolDomAng15Component],
    imports: [CommonModule, ToolDomAng15RoutingModule],
    exports: [ToolDomAng15Component]
})
export class ToolDomAng15Module {
}
