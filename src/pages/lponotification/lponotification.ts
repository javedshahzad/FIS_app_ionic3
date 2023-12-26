import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the LponotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-lponotification',
  templateUrl: 'lponotification.html',
})
export class LponotificationPage {
  notificationall = {
    MynotificationList: [] as any,
    TodayNotification: [] as any,
    YesterdayNotification: [] as any,
    LastWeekNotification: [] as any,
    taskListAll: [] as any
  } as any;

  Searchnotificationall = {} as any;

  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
  }

  ionViewDidLoad() {
    console.log('Loading Notification...');
    this.getNotificationList();
  }
  closeModal() {
    this.view.dismiss();
  }

  getNotificationList() {
    let myTitle = 'Notification';
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
    }

    this.authService.postData(userdata, 'notification/NotificationList').then((result) => {
      this.notificationall = result;
      this.presentLoadingDefault(false);
      //console.log('Notification Listing', this.notificationall);
      if (this.notificationall.MynotificationList.length > 0) {
        //this.presentToast(`Data found in ${myTitle}`);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  loading = this.loadingCtrl.create();
  presentLoadingDefault(show) {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create();
    }
    if (show) {
      this.loading.present();
    }
    else {
      this.loading.dismissAll();
      this.loading = null
    }
  };

  openModel(ID: any,LABEL_ID: any, LABEL_TYPE: any, CASE_REQUEST_ID: any, STATUS_NAME: any, LEASE_NO: any) {
   
   if (LABEL_TYPE == 'CM') {
      this.openCallManagementModal(LABEL_ID, STATUS_NAME);
      this.getNotificationListUpdate(LABEL_TYPE, ID);
    }
    if (LABEL_TYPE == 'LPO') {
      this.openLpocommentsodal(LABEL_ID, STATUS_NAME);
      this.getNotificationListUpdate(LABEL_TYPE, ID);
    }

  }

  openCallManagementModal(CALL_LOG_ID: any, STATUS_NAME: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CALL_LOG_ID: CALL_LOG_ID,
      STATUS_NAME: STATUS_NAME
    }];

    let myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);
    myModal.present();
  }

  openLpocommentsodal(LABEL_ID: any, STATUS_NAME: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LABEL_ID: LABEL_ID
    }];

    let myModal: Modal = this.modal.create('Lpomodelcomments', { data: myModalData }, myModalOptions);
    myModal.present();
  }
  getNotificationListUpdate(LABEL_TYPE: any, LABEL_ID: any ) {
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE,
      ID: LABEL_ID
    }

    this.authService.postData(userdata, 'notification/notificationListUpdate').then((result) => {
      this.notificationall = result;
      this.presentLoadingDefault(false);
      
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }
}