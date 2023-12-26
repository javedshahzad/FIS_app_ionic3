import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PpmscheduleoptionModule } from './ppm_schedule_option';

@NgModule({
  declarations: [
    PpmscheduleoptionModule,
  ],
  imports: [
    IonicPageModule.forChild(PpmscheduleoptionModule),
  ],
})
export class PpmscheduleoptionModuleModule {}
