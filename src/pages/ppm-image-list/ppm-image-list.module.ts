import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PpmImageListPage } from './ppm-image-list';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    PpmImageListPage,
  ],
  imports: [
    IonicPageModule.forChild(PpmImageListPage),
    IonicSelectableModule
  ],
})
export class PpmImageListPageModule {}
