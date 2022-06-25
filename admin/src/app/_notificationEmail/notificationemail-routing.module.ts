import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationEmailEditComponent } from './notificationemail-edit/notificationemail-edit.component';
import { NotificationEmailListComponent } from './notificationemail-list/notificationemail-list.component';



const routes: Routes = [
  {
      path: '',
      component: NotificationEmailListComponent
  },
  {
      path: ':id/edit',

      component: NotificationEmailEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationEmailRoutingModule { }
