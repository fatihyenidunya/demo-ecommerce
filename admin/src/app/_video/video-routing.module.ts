import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoEditComponent } from './video-edit/video-edit.component';
import { VideoListComponent } from './video-list/video-list.component';



const routes: Routes = [
  {
      path: '',
      component: VideoListComponent
  },
  {
      path: ':id/edit',

      component: VideoEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
