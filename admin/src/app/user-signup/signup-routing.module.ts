import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupEditComponent } from './signup-edit/signup-edit.component';
import { SignupListComponent } from './signup-list/signup-list.component';




const routes: Routes = [
    {
        path: '',
        component: SignupListComponent
    },
    {
        path: ':id/edit',

        component: SignupEditComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SignupRoutingModule {
}
