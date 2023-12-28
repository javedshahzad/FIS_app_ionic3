import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController, LoadingController, ViewController, ModalController, ModalOptions } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CallmanagementPage } from '../callmanagement/callmanagement';
import { InventoryPage } from '../inventory/inventory';
import { ReceiptPage } from '../receipt/receipt';
import { SearchPage } from '../search/search';
import { lpoPageModule } from '../lpo/lpo';
import { PpmPageModule } from '../PPM/ppm';
import { NotificationPage } from '../notification/notification';
import { MyprofilePage } from '../myprofile/myprofile'
import { EscalationPage } from '../escalation/escalation';
import { CommentsToCommentsPage } from '../commentstocomments/commentstocomments';
import { TaskManagementPage } from '../taskmanagement/taskmanagement';
import { resourcemanagerPage } from '../resourcemanager/resourcemanager';
import { HotoPage } from '../hoto/hoto';
import { ParkingPage } from '../parking/parking';
import { GlobalProvider } from '../../providers/global/global';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  notificationall = {
    MynotificationList: [] as any,
    TodayNotification: [] as any,
    YesterdayNotification: [] as any,
    LastWeekNotification: [] as any,
    notificationCount: [] as any
  } as any;
  myprofile: any;
  Searchnotificationall = {} as any;
  notificationcount: any;
  escalationdetailsall = {} as any;
  myprofilecount: any;
  ceoesculation_count: any;
  Lpomanament: any;
  lpocount: any;
  user: any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  userdata: any = JSON.parse(this.user);
  //pages: Array<{ title: string, component: any, icon: any }>;
  useraccessdata = {} as any;
  pages = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: RestProvider, 
              public toastCtrl: ToastController,public events: Events,
              public loadingCtrl: LoadingController, public view: ViewController,
              private globalProvider:GlobalProvider, private modal:ModalController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    console.log(this.user)
  }

  callmanagement() {
    if (this.useraccessdata.CALL_MANAGEMENT_ACCESS == 1) {
      this.navCtrl.push(CallmanagementPage, {}, { animate: false });
    }
  }
  OnBtnClickAction(action){
    console.log(action);
    let payLoad ={
      user_info_id: this.user.resourseData.USER_INFO_ID,
      user_name: this.user.resourseData.EMPNAME,
      btn_type:action,
      checkin_location:this.globalProvider.userlocation,
      checkin_latitude:this.globalProvider.geoLatitude,
      checkin_longitude:this.globalProvider.geoLongitude,
      checkout_location:this.globalProvider.userlocation,
      checkout_latitude:this.globalProvider.geoLatitude,
      checkout_longitude:this.globalProvider.geoLongitude,
      modified_by:this.user.resourseData.USER_INFO_ID
    }
    console.log("getInserUserAttendance payload=",payLoad)
    this.authService.postData(payLoad, 'attendance/getInserUserAttendance').then((result: any) => {
      console.log("getInserUserAttendance response = ",result)
    }, (err) => {
      console.log("getInserUserAttendance error = ",err);
      //this.presentToast("Something went to wrong, please try again later");
      this.presentToast(err);
    });
  }
  resourcemanager() {
    if (this.useraccessdata.RESOURCE_ACCESS == 1) {
      this.navCtrl.push(resourcemanagerPage, {}, { animate: false });
    }
  }
  searchTasks(event){
    var value = event.target.value;
    console.log(value)
  }
  InventoryPage() {
    if (this.useraccessdata.INVENTORY_ACCESS == 1) {
      this.navCtrl.push(InventoryPage, {}, { animate: false });
    }
  }

  SearchPage() {
    if (this.useraccessdata.ASSET_DETAILS_ACCESS == 1) {
      this.navCtrl.push(SearchPage, {}, { animate: false });
    }
  }

  ReceiptPage() {
    if (this.useraccessdata.RECEIPT_LIST_ACCESS == 1) {
      this.navCtrl.push(ReceiptPage, {}, { animate: false });
    }
  }

  lpo() {
    if (this.useraccessdata.LPO_ACCESS == 1) {
      this.navCtrl.push(lpoPageModule, {}, { animate: false });
    }
  }

  ppm() {
    if (this.useraccessdata.PPM_ACCESS == 1) {
      this.navCtrl.push(PpmPageModule, {}, { animate: false });
    }
  }

  EscalationPage() {
    if (this.useraccessdata.ESCALATION_ACCESS == 1) {
      this.navCtrl.push(EscalationPage, {}, { animate: false });
    }
  }

  notification() {
    if (this.useraccessdata.NOTIFICATION_ACCESS == 1) {
      localStorage.setItem('notification_count', this.notificationall.MynotificationList.length);
      this.navCtrl.push(NotificationPage, {}, { animate: false });
    }
  }

  Comments_to_comments() {
    if (this.useraccessdata.COMMENTS_ACCESS == 1) {
      this.navCtrl.push(CommentsToCommentsPage, {}, { animate: false });
    }
  }

  task_mgnt() {
    if (this.useraccessdata.TASK_ACCESS == 1) {
      this.navCtrl.push(TaskManagementPage, {}, { animate: false });
    }
  }

  parking() {
    if (this.useraccessdata.PARKING_ACCESS == 1) {
      this.navCtrl.push(ParkingPage, {}, { animate: true, direction: 'forward' });
    }
  }


  hoto() {
    if (this.useraccessdata.HOTO_ACCESS == 1) {
      this.navCtrl.push(HotoPage, {}, { animate: false });
    }
  }

  openModalImg() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    // let myModalData = [{
    //   TASK_ID: 7,
    //   //task_data_val: this.taskdetails.assignedtaskList.filter(item => item.TASK_ID === TASK_ID)
    // }];

    let myModal: any = this.modal.create('ViewPhotosPage', { data: "myModalData" }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    this.getNotificationList();
    this.myprofilecount = 0;
  }



  ionViewWillEnter() {
    this.getUserAccessForm();
    //this.getNotificationList();
    //this. getmyprofiledetails();
    this.Callinspectiondata();
    this.getLpodetails();
  }
 

  getUserAccessForm() {

    let userdata = {
        UserInfoId: this.user.UserInfoId,
        UserEmployeeId: this.user.UserEmployeeId
    }

    if (this.user.UserInfoId != undefined || this.user.UserInfoId > 0) {

      this.authService.dashboardPostData(userdata, 'dashboard/getUserAccessForm').then((result) => {
        this.useraccessdata = result;
        console.log(this.useraccessdata);
        localStorage.setItem('useraccessdata', JSON.stringify(this.useraccessdata));
        this.events.publish('useraccess');
      }, (err) => {
        console.log(err);
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      });
    } else {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }
  }

  getNotificationList() {
    // this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
    }
    let data = [] as any;
    this.authService.postData(userdata, 'notification/notificationList').then((result) => {
      localStorage.setItem('notification_count', data);
      this.presentLoadingDefault(false);
      this.notificationall = result;
      if (this.notificationall.MynotificationList.length > localStorage.notification_count.length) {
        this.notificationcount = this.notificationall.MynotificationList.length;
      } else {
        this.notificationcount = localStorage.notification_count.length;
      }
    }, (err) => {
      //this.presentLoadingDefault(false);
      //this.navCtrl.setRoot(this.navCtrl.getActive().component);
      //this.ionViewWillEnter();
      //this.presentToast("Something went to wrong, please try again later");
    });
  }

  Callinspectiondata() {
    let data = {
      Resoursename: this.resourse.EMPNAME,
      TYPE_ID: this.resourse.TYPE_ID
    }
    this.authService.postData(data, 'Call_inspection/CEO_escalated_calls/').then((result: any) => {
      let count = result.filter(call => call.CEO_ESCLATED_COUNT > 0);
      this.ceoesculation_count = count.length;

    }, (err) => {
      //this.presentLoadingDefault(false);
      //this.presentToast("Something went to wrong, please try again later");
    });
  }

  getLpodetails() {
    this.authService.getData({}, 'Lpo/getlpoListDAL').then((result) => {
      this.Lpomanament = result;
      this.getength();
    }, (err) => {
      //this.presentLoadingDefault(false);
    });
  }

  getength() {
    let Waiting_For_Manager_Verification = this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 1);
    let Waiting_For_Finance_Confirmation = this.Lpomanament.filter(call => call.STATUS_ID === 1 && (call.NEXT_APPROVAL_TYPE === 9 || call.NEXT_APPROVAL_TYPE === 13));
    let Waiting_For_General_Manager_Approval = this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 23);
    let Waiting_For_COO_Approval = this.Lpomanament.filter(call => call.STATUS_ID === 3);
    let Waiting_For_CEO_Approval = this.Lpomanament.filter(call => call.STATUS_ID === 4);
    if (this.resourse.TYPE_USER == 'Manager') {
      this.lpocount = Waiting_For_Manager_Verification.length;
    } else if (this.resourse.TYPE_USER == 'Finance-MGR') {
      this.lpocount = Waiting_For_Finance_Confirmation.length;
    } else if (this.resourse.TYPE_USER == 'General Manager') {
      this.lpocount = Waiting_For_General_Manager_Approval.length;
    } else if (this.resourse.TYPE_USER == 'COO') {
      this.lpocount = Waiting_For_COO_Approval.length;
    } else if (this.resourse.TYPE_USER == 'CEO') {
      this.lpocount = Waiting_For_CEO_Approval.length;
    } else {
      this.lpocount = 0;
    }
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
      this.loading.dismiss();
      this.loading = null
    }
  };

  profile() {
    this.navCtrl.push(MyprofilePage, {}, { animate: false });
  }

  getmyprofiledetails() {
    // this.presentLoadingDefault(true);
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
      //this.presentLoadingDefault(false);
      // this.navCtrl.setRoot(this.navCtrl.getActive().component);
      //this.ionViewWillEnter();
      //this.presentToast("Something went to wrong, please try again later");
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
