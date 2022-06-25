import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './__auth/auth.guard';


const routes: Routes = [

    {
        path: '',
        component: AppComponent,
        children: [
            {
                path: 'login', loadChildren: './login/login.module#LoginModule'
            },

            {
                path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard], data: { roles: ['Admin'] }
            },


            // {
            //     path: 'notifies', loadChildren: './_notify/notify.module#NotifyModule', data: {roles: ['Admin']}
            // }
        ]
    },




];


@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
