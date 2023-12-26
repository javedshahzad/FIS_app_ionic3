import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotoCommentPage } from './hotocomment';

@NgModule({
  declarations: [
    HotoCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(HotoCommentPage),
  ],
  exports: [
    HotoCommentPage
  ]
})
export class DrecCommentsPageModule {}