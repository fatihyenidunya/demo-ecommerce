import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BarberEditComponent } from './barber-edit/barber-edit.component';
import { BarberListComponent } from './barber-list/barber-list.component';



const routes: Routes = [
  {
      path: '',
      component: BarberListComponent
  },
  {
      path: ':id/edit',

      component: BarberEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarberRoutingModule { }
