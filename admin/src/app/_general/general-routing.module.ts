import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralEditComponent } from './general-edit/general-edit.component';
import { GeneralListComponent } from './general-list/general-list.component';



const routes: Routes = [
  {
      path: '',
      component: GeneralListComponent
  },
  {
      path: ':id/edit',

      component: GeneralEditComponent
  }

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
