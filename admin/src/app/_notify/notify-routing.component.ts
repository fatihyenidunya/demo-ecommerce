import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotifyListComponent } from './notify-list/notify-list.component';



const routes: Routes = [
  {
      path: ':notifyFor/:status',
      component: NotifyListComponent
  },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotifyRoutingModule { }
