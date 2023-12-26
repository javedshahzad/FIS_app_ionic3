import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Lpomodelcomments } from './lpo-model';

@NgModule({
  declarations: [
    Lpomodelcomments  ],
  imports: [
    IonicPageModule.forChild(Lpomodelcomments)
  ],
})
export class LpomodelcommentsModule {}