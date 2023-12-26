import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AssetpreventivemaintancePage } from '../assetpreventivemaintance/assetpreventivemaintance';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tab1Root = AssetpreventivemaintancePage;
  tab2Root = DashboardPage;
  constructor(public navCtrl: NavController) {

  }

}
