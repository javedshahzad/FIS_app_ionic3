import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverTaskPage } from './popover-task';

@NgModule({
  declarations: [
    PopoverTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverTaskPage),
  ],
})
export class PopoverTaskPageModule {}
