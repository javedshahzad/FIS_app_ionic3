import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Callinspectionpage } from './callinspection';

@NgModule({
  declarations: [
    Callinspectionpage  ],
  imports: [
    IonicPageModule.forChild(Callinspectionpage)
  ],
})
export class CallinspectionpageModule {}