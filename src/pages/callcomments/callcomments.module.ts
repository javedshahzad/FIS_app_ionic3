import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { callcomments } from './callcomments';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    callcomments  ],
  imports: [
    IonicPageModule.forChild(callcomments),
    IonicSelectableModule
  ],
})
export class callcommentsModule {}