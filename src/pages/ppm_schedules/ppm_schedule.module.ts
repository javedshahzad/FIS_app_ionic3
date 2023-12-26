import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ppmscheduledetails } from './ppm_schedule';


@NgModule({
  declarations: [
    ppmscheduledetails  ],
  imports: [
    IonicPageModule.forChild(ppmscheduledetails)
  ],
})
export class ppmscheduledetailsodule {}