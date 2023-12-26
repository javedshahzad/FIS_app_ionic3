import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { callbillingdetails } from './billingdetails';


@NgModule({
  declarations: [
    callbillingdetails  ],
  imports: [
    IonicPageModule.forChild(callbillingdetails)
  ],
})
export class callbillingdetailsModule {}