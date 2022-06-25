import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CargoCompanyEditComponent } from './cargo-company-edit/cargo-company-edit.component';
import { CargoCompanyListComponent } from './cargo-company-list/cargo-company-list.component';



const routes: Routes = [
  {
      path: '',
      component: CargoCompanyListComponent
  },
  {
      path: ':id/edit',

      component: CargoCompanyEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargoCompanyRoutingModule { }
