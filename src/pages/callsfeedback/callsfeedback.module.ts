import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { callfeedbackpage } from './callsfeedback';

@NgModule({
  declarations: [
    callfeedbackpage  ],
  imports: [
    IonicPageModule.forChild(callfeedbackpage)
  ],
})
export class callfeedbackpageModule {}