import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
    {
        path: ':id',
        component: ProductComponent
    },
    //   {
    //     path: 'deal/:dealid',
    //     component: HomeComponent
    // },

];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }
