import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { IonicSelectableModule  } from 'ionic-selectable';

@NgModule({
  declarations: [
    LoginPage  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    IonicSelectableModule
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {}