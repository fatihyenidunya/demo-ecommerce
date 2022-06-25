import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankAccountListComponent } from './bank-account-list/bank-account-list.component';
import { BankAccountEditComponent } from './bank-account-edit/bank-account-edit.component';


const routes: Routes = [
  {
      path: '',
      component: BankAccountListComponent
  },
  {
      path: ':id/edit',

      component: BankAccountEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankAccountRoutingModule { }
