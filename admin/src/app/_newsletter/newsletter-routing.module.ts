import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsletterEditComponent } from './newsletter-edit/newsletter-edit.component';
import { NewsletterListComponent } from './newsletter-list/newsletter-list.component';



const routes: Routes = [
  {
      path: '',
      component: NewsletterListComponent
  },
  {
      path: ':id/edit',

      component: NewsletterEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterRoutingModule { }
