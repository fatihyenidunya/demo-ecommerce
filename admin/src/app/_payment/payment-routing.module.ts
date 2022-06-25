import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentEditComponent } from './payment-edit/payment-edit.component';
import { PaymentListComponent } from './payment-list/payment-list.component';



const routes: Routes = [
  {
      path: '',
      component: PaymentListComponent
  },
  {
      path: ':id',

      component: PaymentEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
