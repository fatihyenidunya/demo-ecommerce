import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsListComponent } from './sms-list/sms-list.component';


const routes: Routes = [
  {
    path: '',
    component: SmsListComponent
  }

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutingModule { }
