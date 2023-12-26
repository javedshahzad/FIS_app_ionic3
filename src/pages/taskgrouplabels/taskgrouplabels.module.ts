import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskGroupLabelPage } from './taskgrouplabels';


@NgModule({
  declarations: [
    TaskGroupLabelPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskGroupLabelPage),
  ],
  exports: [
    TaskGroupLabelPage
  ]
})
export class TaskGroupLabelPageModule {}