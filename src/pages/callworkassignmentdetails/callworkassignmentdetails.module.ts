import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { callworkassignmentdetails } from './callworkassignmentdetails';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  declarations: [
    callworkassignmentdetails  ],
  imports: [
    IonicPageModule.forChild(callworkassignmentdetails),
    IonicSelectableModule
  ],
})
export class callworkassignmentdetailsModule {}