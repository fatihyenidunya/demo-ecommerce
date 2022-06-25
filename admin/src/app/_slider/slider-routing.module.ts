import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SliderEditComponent } from './slider-edit/slider-edit.component';
import { SliderListComponent } from './slider-list/slider-list.component';



const routes: Routes = [
  {
      path: '',
      component: SliderListComponent
  },
  {
      path: ':id/edit',

      component: SliderEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SliderRoutingModule { }
