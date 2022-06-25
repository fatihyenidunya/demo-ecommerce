import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailEditComponent } from './email-edit/email-edit.component';
import { EmailListComponent } from './email-list/email-list.component';



const routes: Routes = [
  {
      path: '',
      component: EmailListComponent
  },
  {
      path: ':id/edit',

      component: EmailEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule { }
