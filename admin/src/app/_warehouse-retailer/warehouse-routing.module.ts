import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarehouseRetailListComponent } from './warehouse-retail-list/warehouse-retail-list.component';
import { WarehouseRetailEditComponent } from './warehouse-retail-edit/warehouse-retail-edit.component';

const routes: Routes = [
  {
    path: '',
    component: WarehouseRetailListComponent
  },
  {
    path: ':id',

    component: WarehouseRetailEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRetailRoutingModule { }
