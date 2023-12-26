import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { userresorcelistPage } from './userresorcelist';

@NgModule({
  declarations: [
    userresorcelistPage,
  ],
  imports: [
    IonicPageModule.forChild(userresorcelistPage),
  ],
  exports: [
    userresorcelistPage
  ]
})
export class UserAssignedTaskPageModule {}