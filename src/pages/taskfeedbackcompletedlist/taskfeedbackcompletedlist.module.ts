import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { taskCompletedfeedbackpage } from './taskfeedbackcompletedlist';

@NgModule({
  declarations: [
    taskCompletedfeedbackpage  ],
  imports: [
    IonicPageModule.forChild(taskCompletedfeedbackpage)
  ],
})
export class taskCompletedfeedbackpageModule {}