import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpenWebsitePage } from './openwebsite';

@NgModule({
  declarations: [
    OpenWebsitePage,
  ],
  imports: [
    IonicPageModule.forChild(OpenWebsitePage),
  ],
})
export class OpenWebsitePageModule {}
