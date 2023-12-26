import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { taskFeedbackCompletedViewePage } from './taskfeedbackcompletedview';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    taskFeedbackCompletedViewePage  ],
  imports: [
    IonicPageModule.forChild(taskFeedbackCompletedViewePage),
    SignaturePadModule
  ],
})
export class taskFeedbackCompletedViewePageModule {}