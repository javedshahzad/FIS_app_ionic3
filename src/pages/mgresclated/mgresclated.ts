import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';

@Component({
  selector: 'page-mgresclated',
  templateUrl: 'mgresclated.html',
})
export class MgresclatedPage {
  insertedValues: any;
  calldata: any;
  Callallactivevalue: any;
  Callallactivelist: any;
  searchData = { "search_value": "" };
  Callallactive = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
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

  ionViewWillLoad() {
    this.Callinspectiondata();
  }

  Callinspectiondata() {

    let time_bf = new Date();
    this.presentLoadingDefault(true);
    let data = {
      Resoursename: this.resourse.EMPNAME,
      TYPE_ID: this.resourse.TYPE_ID
    }
    this.authService.postData(data, 'Call_inspection/MGR_escalated_calls/').then((result: any) => {
      this.presentLoadingDefault(false);
      this.Callallactivevalue = result.filter(call => call.MGR_ESCLATED_COUNT > 0);

      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log('Seconds:', seconds);

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
  closeModal() {
    this.view.dismiss();
  }

  SearchcallManagement() {
    let call_id = parseInt(this.searchData.search_value);
    let item = this.searchData.search_value;
    if (item != '') {
      if (isNaN(call_id)) {
        this.Callallactivevalue = this.Callallactivelist.filter(call => (call.REQUESTOR_NAME ? call.REQUESTOR_NAME.includes(item) : false));
      } else if (!isNaN(call_id)) {
        this.Callallactivevalue = this.Callallactivelist.filter(call => call.CALL_LOG_ID === call_id);
      }
    } else {
      this.Callallactivevalue = this.Callallactivelist;
    }
  }

  openModal(CALL_LOG_ID: any, STATUS_NAME: any, REQUESTOR_NAME) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      CALL_LOG_ID: CALL_LOG_ID,
      STATUS_NAME: STATUS_NAME,
      REQUESTOR_NAME: REQUESTOR_NAME
    }];

    const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {      
    });

  }
  showBtn = -1;
  isOpen = false;
  oldBtn = -1;
  showUndoBtn(index) {
    if (this.isOpen = false) {
      this.isOpen = true;
      this.oldBtn = index;
      this.showBtn = index;
    } else {
      if (this.oldBtn == index) {
        this.isOpen = false;
        this.showBtn = -1;
        this.oldBtn = -1;
      } else {
        this.showBtn = index;
        this.oldBtn = index;
      }
    }
  }

  createtask(CALL_LOG_ID, REQUESTOR_NAME, UNIT) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      TASK_ID: -1,
      CALL_LOG_ID: CALL_LOG_ID,
      REQUESTOR_NAME: REQUESTOR_NAME,
      UNIT: UNIT
    }]

    const myModal: Modal = this.modal.create(CreateTaskPage, { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }

  gettask(CALL_LOG_ID) {
    let data = {
      CALL_LOG_ID: CALL_LOG_ID,
      UserInfoId: this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'Call_inspection/Get_tasklist_by_calllog').then((result: any) => {

      this.presentLoadingDefault(false);
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [
        result,
        'CALL_LOG'
      ];

      let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
      });
      myModal.onWillDismiss((data) => {
      });
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }
}
