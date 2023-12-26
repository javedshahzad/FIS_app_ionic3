import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentsLabelsPage } from './commentslabels';

@NgModule({
  declarations: [
    CommentsLabelsPage  ],
  imports: [
    IonicPageModule.forChild(CommentsLabelsPage)
  ],
})
export class CommentsLabelsPageModule {}