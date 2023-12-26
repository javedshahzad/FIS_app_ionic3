import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { createcall } from './createcall';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    createcall  ],
  imports: [
    IonicPageModule.forChild(createcall),
    IonicSelectableModule
  ],
})
export class createcallModule {}