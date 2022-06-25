import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryProductListComponent } from './category-product-list/category-product-list.component';



const routes: Routes = [
  {
      path: ':category',
      component: CategoryProductListComponent
  },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
