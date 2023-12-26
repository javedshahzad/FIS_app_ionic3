import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { callsfeedbackcompletedviewepage } from './callsfeedbackcompletedview';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    callsfeedbackcompletedviewepage  ],
  imports: [
    IonicPageModule.forChild(callsfeedbackcompletedviewepage),
    SignaturePadModule
  ],
})
export class callsfeedbackcompletedviewepageModule {}