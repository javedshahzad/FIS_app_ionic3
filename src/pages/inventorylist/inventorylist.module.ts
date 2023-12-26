import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventorylistPage } from './inventorylist';

@NgModule({
  declarations: [
    InventorylistPage,
  ],
  imports: [
    IonicPageModule.forChild(InventorylistPage),
  ],
})
export class InventorylistPageModule {}
