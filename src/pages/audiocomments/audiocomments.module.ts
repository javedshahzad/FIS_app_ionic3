import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AudioCommentsPage } from './audiocomments';


@NgModule({
  declarations: [
    AudioCommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(AudioCommentsPage),
  ],
  exports: [
    AudioCommentsPage
  ]
})
export class AudioCommentsPageModule {}