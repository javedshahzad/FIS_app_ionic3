import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskFileUploadsPage } from './taskattachment';

@NgModule({
  declarations: [
    TaskFileUploadsPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskFileUploadsPage),
  ],
  exports: [
    TaskFileUploadsPage
  ]
})
export class TaskFileUploadsPageModule {}