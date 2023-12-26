import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ppmoptions } from './ppm_options';

@NgModule({
  declarations: [
    ppmoptions,
  ],
  imports: [
    IonicPageModule.forChild(ppmoptions),
  ],
})
export class ppmoptionsModule {}
