import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiptListPage } from './receiptlist';

@NgModule({
  declarations: [
    ReceiptListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptListPage)
  ],
})
export class ReceiptListPageModule {}
