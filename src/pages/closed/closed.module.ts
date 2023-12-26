import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { closedpage } from './closed';

@NgModule({
  declarations: [
    closedpage  ],
  imports: [
    IonicPageModule.forChild(closedpage)
  ],
})
export class closedpageModule {}