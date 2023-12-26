import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { callinspectiondetails } from './callinspectiondetails';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    callinspectiondetails  ],
  imports: [
    IonicPageModule.forChild(callinspectiondetails),
    IonicSelectableModule
  ],
})
export class callinspectiondetailsModule {}