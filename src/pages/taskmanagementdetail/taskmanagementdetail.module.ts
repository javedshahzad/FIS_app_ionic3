import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskManagementDetailPage } from './taskmanagementdetail';

@NgModule({
  declarations: [
    TaskManagementDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskManagementDetailPage),
  ],
  exports: [
    TaskManagementDetailPage
  ]
})
export class TaskManagementDetailPageModule {}