import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentsToCommentsPage } from './commentstocomments';

@NgModule({
  declarations: [
    CommentsToCommentsPage  ],
  imports: [
    IonicPageModule.forChild(CommentsToCommentsPage)
  ],
})
export class CommentsToCommentsPageModule {}