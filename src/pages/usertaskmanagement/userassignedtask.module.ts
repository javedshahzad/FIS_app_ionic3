import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAssignedTaskPage } from './userassignedtask';

@NgModule({
  declarations: [
    UserAssignedTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAssignedTaskPage),
  ],
  exports: [
    UserAssignedTaskPage
  ]
})
export class UserAssignedTaskPageModule {}