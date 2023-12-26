import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResManagerUserlistPage } from './res-manager-userlist';

@NgModule({
  declarations: [
    ResManagerUserlistPage,
  ],
  imports: [
    IonicPageModule.forChild(ResManagerUserlistPage),
  ],
})
export class ResManagerUserlistPageModule {}
