import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { allactivecallspage } from './allactivecalls';

@NgModule({
  declarations: [
    allactivecallspage  ],
  imports: [
    IonicPageModule.forChild(allactivecallspage)
  ],
})
export class allactivecallspageModule {}