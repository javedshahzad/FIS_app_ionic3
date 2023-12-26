import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { confirmationdetails } from './confirmationdetails';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    confirmationdetails  ],
  imports: [
    IonicPageModule.forChild(confirmationdetails),
    IonicSelectableModule
  ],
})
export class confirmationdetailsModule {}