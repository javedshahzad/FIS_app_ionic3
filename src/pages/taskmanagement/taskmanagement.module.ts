import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskManagementPage } from './taskmanagement';


@NgModule({
  declarations: [
    TaskManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskManagementPage),
  ],
  exports: [
    TaskManagementPage
  ]
})
export class TaskManagementPageModule {}