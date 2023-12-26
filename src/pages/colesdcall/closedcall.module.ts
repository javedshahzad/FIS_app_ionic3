import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { closedcallpage } from './closedcall';

@NgModule({
  declarations: [
    closedcallpage  ],
  imports: [
    IonicPageModule.forChild(closedcallpage)
  ],
})
export class closedcallpageModule {}