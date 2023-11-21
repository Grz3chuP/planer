import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlanerComponent} from "./planer/planer.component";

const routes: Routes = [
  { path: 'planer', component: PlanerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
