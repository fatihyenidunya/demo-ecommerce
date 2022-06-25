import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRetailEditComponent } from './order-retail-edit/order-retail-edit.component';
import { OrderRetailListComponent } from './order-list/order-retail-list.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../__auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: OrderRetailListComponent
  },
  {
    path: 'dashboard/:status',
    component: OrderRetailListComponent
  },
  {
    path: ':id',

    component: OrderRetailEditComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
