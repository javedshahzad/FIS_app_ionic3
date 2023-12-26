import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateTaskPage } from './updatetask';
import { IonicSelectableModule } from 'ionic-selectable';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    UpdateTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateTaskPage),
    IonicSelectableModule,
    CalendarModule
  ],
  exports: [
    UpdateTaskPage
  ]
})
export class UpdateTaskPageModule {}