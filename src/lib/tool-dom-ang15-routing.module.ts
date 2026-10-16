// tool-dom-ang15-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolDomAng15Component } from './tool-dom-ang15.component';

const routes: Routes = [
    { path: '', component: ToolDomAng15Component },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ToolDomAng15RoutingModule {}
