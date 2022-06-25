import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommentEditComponent } from './comment-edit/comment-edit.component';
import { CommentListComponent } from './comment-list/comment-list.component';



const routes: Routes = [
  {
      path: '',
      component: CommentListComponent
  },
  {
      path: ':id',

      component: CommentEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommentRoutingModule { }
