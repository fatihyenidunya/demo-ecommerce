import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    {
        path: ':id',
        component: ProfileComponent
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
