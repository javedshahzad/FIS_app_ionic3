import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { callsfeedbackupdatepage } from './callsfeedbackupdate';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    callsfeedbackupdatepage  ],
  imports: [
    IonicPageModule.forChild(callsfeedbackupdatepage),
    SignaturePadModule
  ],
})
export class callsfeedbackupdatepageModule {}