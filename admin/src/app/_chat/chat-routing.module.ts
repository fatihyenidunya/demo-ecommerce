import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatEditComponent } from './chat-edit/chat-edit.component';
import { ChatListComponent } from './chat-list/chat-list.component';



const routes: Routes = [
  {
      path: '',
      component: ChatListComponent
  },
  {
      path: ':id',

      component: ChatEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
