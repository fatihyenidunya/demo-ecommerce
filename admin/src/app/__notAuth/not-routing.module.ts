import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotComponent } from './notAuth/not.component';



const routes: Routes = [
  {
      path: '',
      component: NotComponent
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotRoutingModule { }
