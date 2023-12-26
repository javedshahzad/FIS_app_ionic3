import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { callestimationpage } from './callestimation';

@NgModule({
  declarations: [
    callestimationpage  ],
  imports: [
    IonicPageModule.forChild(callestimationpage)
  ],
})
export class callestimationpageModule {}