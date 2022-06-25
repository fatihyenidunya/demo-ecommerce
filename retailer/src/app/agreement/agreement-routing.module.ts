import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementComponent } from './agreement/agreement.component';

const routes: Routes = [
    {
        path: ':orderId',
        component: AgreementComponent
    }

];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChatRoutingModule { }
