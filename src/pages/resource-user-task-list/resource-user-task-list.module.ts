import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResourseUserTaskListPage } from './resource-user-task-list';

@NgModule({
  declarations: [
    ResourseUserTaskListPage,
  ],
  imports: [
    IonicPageModule.forChild(ResourseUserTaskListPage),
  ],
})
export class ResourseUserTaskListPageModule {}
