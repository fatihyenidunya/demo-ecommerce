import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuComponent } from './menu/menu.component';
import { MenuEditComponent } from './menu-edit/menu-edit.component';


const routes: Routes = [
  {
      path: '',
      component: MenuComponent
  },

  {
    path: ':id/edit',
    component: MenuEditComponent
},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotRoutingModule { }
