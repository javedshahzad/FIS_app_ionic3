import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotoUpdateStatusPage } from './hotoupdatestatus';

@NgModule({
  declarations: [
    HotoUpdateStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(HotoUpdateStatusPage),
  ],
  exports: [
    HotoUpdateStatusPage
  ]
})
export class HotoUpdateStatusPageModule {}