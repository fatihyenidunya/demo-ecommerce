import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { BlogListComponent } from './blog-list/blog-list.component';



const routes: Routes = [
  {
      path: '',
      component: BlogListComponent
  },
  {
      path: ':id/edit',

      component: BlogEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
