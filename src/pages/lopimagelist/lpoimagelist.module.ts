import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { lpoimagelist } from './lpoimagelist';

@NgModule({
  declarations: [
    lpoimagelist,
  ],
  imports: [
    IonicPageModule.forChild(lpoimagelist),
  ],
})
export class lpoimagelistModule {}
