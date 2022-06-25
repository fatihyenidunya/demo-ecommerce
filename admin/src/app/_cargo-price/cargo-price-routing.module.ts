import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CargoPriceEditComponent } from './cargo-price-edit/cargo-price-edit.component';
import { CargoPriceListComponent } from './cargo-price-list/cargo-price-list.component';



const routes: Routes = [
  {
      path: '',
      component: CargoPriceListComponent
  },
  {
      path: ':id/edit',

      component: CargoPriceEditComponent 
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargoPriceRoutingModule { }
