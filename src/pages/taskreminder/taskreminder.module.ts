import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskReminderPage } from './taskreminder';


@NgModule({
  declarations: [
    TaskReminderPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskReminderPage),
  ],
  exports: [
    TaskReminderPage
  ]
})
export class TaskReminderPageModule {}