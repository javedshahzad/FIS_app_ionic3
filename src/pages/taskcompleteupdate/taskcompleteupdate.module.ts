import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskCompleteUpdatePage } from './taskcompleteupdate';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    TaskCompleteUpdatePage  ],
  imports: [
    IonicPageModule.forChild(TaskCompleteUpdatePage),
    SignaturePadModule
  ],
})
export class TaskCompleteUpdatePageModule {}