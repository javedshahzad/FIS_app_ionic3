import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPhotosPage } from './view-photos';

@NgModule({
  declarations: [
    ViewPhotosPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPhotosPage),
  ],
  exports:[ViewPhotosPage]
})
export class ViewPhotosPageModule {}
