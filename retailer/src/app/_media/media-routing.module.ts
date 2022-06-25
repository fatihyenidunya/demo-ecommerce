import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MediaComponent } from './media/media.component';

const routes: Routes = [
    {
        path: '',
        component: MediaComponent
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
export class MediaRoutingModule { }
