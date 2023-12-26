import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskAudioPage } from './taskaudio';


@NgModule({
  declarations: [
    TaskAudioPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskAudioPage),
  ],
  exports: [
    TaskAudioPage
  ]
})
export class TaskAudioPageModule {}