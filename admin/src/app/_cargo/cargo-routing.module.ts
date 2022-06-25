import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CargoListComponent } from './cargo-list/cargo-list.component';
import { CargoEditComponent } from './cargo-edit/cargo-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CargoListComponent
  },
  {
    path: ':id',

    component: CargoEditComponent
  },
  {
    path: ':id/:from',

    component: CargoEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }
