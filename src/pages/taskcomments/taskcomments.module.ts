import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskCommentPage } from './taskcomments';
import { RichTextModule } from 'ionic-rich-text/dist/rich-text-module';

@NgModule({
  declarations: [
    TaskCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskCommentPage),
    RichTextModule 
  ],
  exports: [
    TaskCommentPage
  ]
})
export class DrecCommentsPageModule {}