import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, NavParams, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { Badge } from '@ionic-native/badge';
//import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-openwebsite',
  templateUrl: 'openwebsite.html',
})
export class OpenWebsitePage {

  url: string = 'http://fakhruddinproperties.com/';

  user: any = localStorage.getItem('userData');
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public authService: RestProvider,
              public loadingCtrl: LoadingController,  public view: ViewController,
              public navParams: NavParams
              
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};    
  
    // const options: InAppBrowserOptions = {
    //   zoom : 'no'
    // }

    //const browser = this.inAppBrowser.create(this.url, '_self', options)
    //browser.show();
  }
  
 
}
