import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { completedfeedbackpage } from './callsfeedbackcompletedlist';

@NgModule({
  declarations: [
    completedfeedbackpage  ],
  imports: [
    IonicPageModule.forChild(completedfeedbackpage)
  ],
})
export class completedfeedbackpageModule {}