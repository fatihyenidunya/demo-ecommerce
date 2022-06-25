import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorListComponent } from './error-list/error-list.component';
import { ErrorEditComponent } from './error-edit/error-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorListComponent
  },
  {
    path: ':id',

    component: ErrorEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
