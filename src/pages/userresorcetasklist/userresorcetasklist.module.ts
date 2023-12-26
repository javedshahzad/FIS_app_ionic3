import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { userresorcetasklistPage } from './userresorcetasklist';

@NgModule({
  declarations: [
    userresorcetasklistPage,
  ],
  imports: [
    IonicPageModule.forChild(userresorcetasklistPage),
  ],
  exports: [
    userresorcetasklistPage
  ]
})
export class userresorcetasklistPageModule {}