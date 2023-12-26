import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LponotificationPage } from '../lponotification/lponotification';
import { DashboardPage } from '../dashboard/dashboard';


@Component({
  selector: 'page-lpo',
  templateUrl: 'lpo.html',
})

export class lpoPageModule {

  lpoList: any;
  lpoDetails: any;
  lpoDetailsdata: any;
  Lpomanament: any;
  Waiting_For_Manager_Verification_length: any;
  Waiting_For_Finance_Confirmation_length: any;
  Waiting_For_General_Manager_Approval_length: any;
  Waiting_For_COO_Approval_length: any;
  Waiting_For_CEO_Approval_length: any;
  Pending_for_lpo_cancellation_length: any;
  Rejected_LPO_length: any;
  All_LPO_List_length: any;
  CEO_Approved_length: any;  
  SearchListall: any;

  notificationall = {
    MynotificationList: [] as any,
    TodayNotification: [] as any,
    YesterdayNotification: [] as any,
    LastWeekNotification: [] as any
  } as any;

  LPO_notification: any;
  myprofilecount: any;
  myprofile: any;
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');
  userdata: any = JSON.parse(this.user);
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  ResourseList: any;
  Escalation_to_coo_ceo: any;
  Ceo_approval_for_other_manager: any;
  multiple_approval_count: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
  }

  notification() {
    this.navCtrl.push(LponotificationPage, {}, { animate: false });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad lpoPage');
    // this.getLpodetails();
    // this.getNotificationList();
    this.myprofilecount = 0;
    // this.getmyprofiledetails();
  }

  ionViewDidEnter() {
    this.getLpodetails();
    this.getNotificationList();
    this.myprofilecount = 0;
    //this.getmyprofiledetails();
  }

  SearchInventory() {
    // Your app login API web service call triggers 

    this.authService.postData(this.searchData, 'lpo/getlopList').then((result) => {
      this.lpoList = result;
    });
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

  // getLpodetails() {
  //   this.presentLoadingDefault(true);
  //   this.authService.getData({}, 'Lpo/getLpoCount').then((result) => {
  //     this.Waiting_For_Manager_Verification_length = result['WAIT_MANAGER_VERIFICATION'];
  //     this.Waiting_For_Finance_Confirmation_length = result['WAIT_FINANCE_CONFIRMATION'];
  //     this.Waiting_For_General_Manager_Approval_length = result['WAIT_GENERAL_MANAGER_APPROVAL'];
  //     this.Waiting_For_COO_Approval_length = result['WAIT_COO_APPROVAL'];
  //     this.Waiting_For_CEO_Approval_length = result['WAIT_CEO_APPROVAL'];
  //     this.Rejected_LPO_length = result['REJECTED_LPO'];
  //     this.All_LPO_List_length = result['ALL_LPO'];
  //     this.CEO_Approved_length = result['CEO_APPROVED'];
  //     this.Pending_for_lpo_cancellation_length = result['PENDING_FOR_LPO_CANCELLATION'];      
  //     this.presentLoadingDefault(false);
  //   }, (err) => {
  //     this.presentLoadingDefault(false);
  //   });
  // }

  getLpodetails() {
    this.ResourseList = this.resourse;
    let time_bf = new Date();
    
    let params = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      resourceTypeId: this.ResourseList.TYPE_ID,
      resourceTypeUser: this.ResourseList.TYPE_USER,
      isteppan: this.ResourseList.ISTEPPAN,
      isfm: this.ResourseList.ISFM,
      isalllpo: this.ResourseList.ISALLLPO
    }

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'Lpo/getLpoCountByUser').then((result) => {
      this.Waiting_For_Manager_Verification_length = result['WAIT_MANAGER_VERIFICATION'];
      this.Waiting_For_Finance_Confirmation_length = result['WAIT_FINANCE_CONFIRMATION'];
      this.Waiting_For_General_Manager_Approval_length = result['WAIT_GENERAL_MANAGER_APPROVAL'];
      this.Waiting_For_COO_Approval_length = result['WAIT_COO_APPROVAL'];
      this.Waiting_For_CEO_Approval_length = result['WAIT_CEO_APPROVAL'];
      this.Rejected_LPO_length = result['REJECTED_LPO'];
      this.All_LPO_List_length = result['ALL_LPO'];
      this.CEO_Approved_length = result['CEO_APPROVED'];
      this.Pending_for_lpo_cancellation_length = result['PENDING_FOR_LPO_CANCELLATION'];
      this.Escalation_to_coo_ceo = result['ESCALATION_CEO_COO'];
      this.Ceo_approval_for_other_manager = result['WAIT_CEO_APP_OTHER_MANAGER'];
      
      if (this.ResourseList.TYPE_USER === "COO") {
        this.multiple_approval_count = result['WAIT_COO_APPROVAL'];
      } else if (this.ResourseList.TYPE_USER === "CEO") {
        this.multiple_approval_count = result['WAIT_CEO_APPROVAL'];
      } else {
        this.multiple_approval_count = 0;
      }

      this.presentLoadingDefault(false);

      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      //let x = this.secondsToDhms(seconds);
      console.log('Seconds:', seconds);

    }, (err) => {
      this.presentLoadingDefault(false);
    });

  }

  closeModal() {
    this.view.dismiss();
  }

  getength() {
    let Waiting_For_Manager_Verification = this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 1);
    let Waiting_For_Finance_Confirmation = this.Lpomanament.filter(call => call.STATUS_ID === 1 && (call.NEXT_APPROVAL_TYPE === 9 || call.NEXT_APPROVAL_TYPE === 13));
    let Waiting_For_General_Manager_Approval = this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 23);
    let Waiting_For_COO_Approval = this.Lpomanament.filter(call => call.STATUS_ID === 3);
    let Waiting_For_CEO_Approval = this.Lpomanament.filter(call => call.STATUS_ID === 4);
    let Rejected_LPO = this.Lpomanament.filter(call => call.STATUS_ID === 0 && call.IS_REJECTED != 0);
    let All_LPO_List = this.Lpomanament;
    let CEO_Approved = this.Lpomanament.filter(call => call.STATUS_ID === 5);
    let Pending_for_lpo_cancellation = this.Lpomanament.filter(call => call.IS_CANCEL_REQUESTED === 1);

    this.Waiting_For_Manager_Verification_length = Waiting_For_Manager_Verification.length;
    this.Waiting_For_Finance_Confirmation_length = Waiting_For_Finance_Confirmation.length;
    this.Waiting_For_General_Manager_Approval_length = Waiting_For_General_Manager_Approval.length;
    this.Waiting_For_COO_Approval_length = Waiting_For_COO_Approval.length;
    this.Waiting_For_CEO_Approval_length = Waiting_For_CEO_Approval.length;
    this.Rejected_LPO_length = Rejected_LPO.length;
    this.All_LPO_List_length = All_LPO_List.length;
    this.CEO_Approved_length = CEO_Approved.length;
    this.Pending_for_lpo_cancellation_length = Pending_for_lpo_cancellation.length;
    this.presentLoadingDefault(false);
  };

  getNotificationList() {
    // this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
    }

    this.authService.postData(userdata, 'notification/notificationList').then((result) => {
      this.notificationall = result;
      //  this.presentLoadingDefault(false);
      //console.log('Notification',this.notificationall);
      this.LPO_notification = this.notificationall.MynotificationList.filter(call => call.LABEL_TYPE === 'LPO')
    }, (err) => {
      //  this.presentLoadingDefault(false);
      this.presentToast(err);
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

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }


  Waiting_For_Manager_Verification_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      search_value: '',
      Lpomanament: [],//this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 1),
      type: 'Manager'
    }]

    const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidEnter();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
      this.ionViewDidEnter();
    });

  }

  Waiting_For_Finance_Confirmation_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      search_value: '',
      Lpomanament: [],//this.Lpomanament.filter(call => call.STATUS_ID === 1 && (call.NEXT_APPROVAL_TYPE === 9 || call.NEXT_APPROVAL_TYPE === 13)),
      type: 'Finance-MGR'
    }]

    const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidEnter();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
      this.ionViewDidEnter();
    });

  }

  Waiting_For_General_Manager_Approval_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      search_value: '',
      Lpomanament: [],//this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 23),
      type: 'General Manager'
    }]

    const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidEnter();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
      this.ionViewDidEnter();
    });

  }


  Waiting_For_COO_Approval_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      search_value: '',
      Lpomanament: [],//this.Lpomanament.filter(call => call.STATUS_ID === 3),
      type: 'COO'
    }]

    const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidEnter();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
      this.ionViewDidEnter();
    });

  }

  Waiting_For_CEO_Approval_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      search_value: '',
      Lpomanament: [],//this.Lpomanament.filter(call => call.STATUS_ID === 4),
      type: 'CEO'
    }]

    const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidEnter();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
      this.ionViewDidEnter();
    });

  }

  Rejected_LPO_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      search_value: '',
      Lpomanament: [],//this.Lpomanament.filter(call => call.STATUS_ID === 0 && call.IS_REJECTED != 0),
      type: 'Rejected'
    }]

    const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidEnter();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
      this.ionViewDidEnter();
    });

  }

  CEO_Approved_length_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      search_value: '',
      Lpomanament: [],//this.Lpomanament.filter(call => call.STATUS_ID === 5),
      type: 'CEO_App'
    }]

    const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidEnter();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
      this.ionViewDidEnter();
    });

  }

  All_LPO_List_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      search_value: '',
      Lpomanament: this.Lpomanament,
      type: 'All'
    }]

    const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidEnter();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
      this.ionViewDidEnter();
    });

  }

  Pending_for_lpo_cancellation_length_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      search_value: '',
      Lpomanament: [],
      type: 'Pending'
    }]

    const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidEnter();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
      this.ionViewDidEnter();
    });

  }

  SearchcallManagement() {
    if (this.searchData.search_value) {

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let mymodaldata = [{
        search_value: this.searchData.search_value,
        Lpomanament: [],
        type: 'All'
      }]

      const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

      myModal.present();

      myModal.onDidDismiss(() => {
        console.log("I have dismissed.");
        this.ionViewDidEnter();
      });

      myModal.onWillDismiss(() => {
        console.log("I'm about to dismiss");
        this.ionViewDidEnter();
      });
    }
  }

  getmyprofiledetails() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'account/Getmyprofileupdate/' + this.userdata.UserInfoId + '').then((result) => {
      this.myprofile = result;
      //console.log('Profile',this.myprofile);
      this.presentLoadingDefault(false);
      if (this.myprofile.length > 0) {
        this.myprofilecount = 1;
      } else {
        //this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }
  getImage(row_no, item: any) {

    let objFile = this.myprofile.find(o => o.ID === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];

    if (extn == "jpg" || extn == "jpeg" || extn == "png") {
      if (this.myprofile.length > 0) {
        return `data:image/${extn};base64,${this.encode(bytes)}`;
      } else {
        return `./assets/imgs/no-found-photo.png`
      }
    }
  }

  encode(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
      chr1 = input[i++];
      chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
      chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
        keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
  }
}