import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessageEditComponent } from './message-edit/message-edit.component';
import { MessageListComponent } from './message-list/message-list.component';



const routes: Routes = [
  {
      path: '',
      component: MessageListComponent
  },
  {
      path: ':id/edit',

      component: MessageEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageRoutingModule { }
