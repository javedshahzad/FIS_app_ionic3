import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { billingpage } from './billing';

@NgModule({
  declarations: [
    billingpage  ],
  imports: [
    IonicPageModule.forChild(billingpage)
  ],
})
export class billingpageModule {}