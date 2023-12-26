import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiptcreatePage } from './receiptcreate';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    ReceiptcreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptcreatePage),
    IonicSelectableModule
  ],
})
export class ReceiptcreatePageModule {}
