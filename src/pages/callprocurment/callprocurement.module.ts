import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { callprocurementpage } from './callprocurement';

@NgModule({
  declarations: [
    callprocurementpage  ],
  imports: [
    IonicPageModule.forChild(callprocurementpage)
  ],
})
export class callprocurementpageModule {}