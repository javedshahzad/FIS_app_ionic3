import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ToastController, AlertController, LoadingController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SearchPage } from '../pages/search/search';
import { InventoryPage } from '../pages/inventory/inventory';
import { ReceiptPage } from '../pages/receipt/receipt';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { CallmanagementPage } from '../pages/callmanagement/callmanagement';
import { lpoPageModule } from '../pages/lpo/lpo';
import { PpmPageModule } from '../pages/PPM/ppm';
import { NotificationPage } from '../pages/notification/notification';
import { EscalationPage } from '../pages/escalation/escalation';
import { CommentsToCommentsPage } from '../pages/commentstocomments/commentstocomments';
import { TaskManagementPage } from '../pages/taskmanagement/taskmanagement';
import { FCM } from '@ionic-native/fcm';
import { HotoPage } from '../pages/hoto/hoto';
import { ParkingPage } from '../pages/parking/parking';
import { resourcemanagerPage } from '../pages/resourcemanager/resourcemanager';
import { RestProvider } from '../providers/rest/rest';


@Component({
  templateUrl: 'app.html'
})
export class ceoportal {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any, icon: any }>;
  public user = {} as any;
  useraccessdata: any;
  public RememberMe = {} as any;
  tasksearchlist: any;
  myModalData: any;
  userSurname = '';

  constructor(public platform: Platform, public statusBar: StatusBar, public events: Events,
    public alertCtrl: AlertController, public splashScreen: SplashScreen,
    public toastCtrl: ToastController, private fcm: FCM,
    private modal: ModalController, public loadingCtrl: LoadingController,
    public authService: RestProvider,
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    // this.pages = [
    //   { title: 'Dashboard ', component: DashboardPage, icon: 'fa  fa-tachometer fa-lg' },
    //   { title: 'Asset Detail', component: SearchPage, icon: 'fa  fa-barcode fa-lg' },
    //   { title: 'Inventory', component: InventoryPage, icon: 'fa fa-cubes fa-lg' },
    //   { title: 'Receipts', component: ReceiptPage, icon: 'fa fa-file-text fa-lg' },
    //   { title: 'Call Management', component: CallmanagementPage, icon: 'fa fa-phone fa-lg' },
    //   { title: 'LPO', component: lpoPageModule, icon: 'fa fa-shopping-cart' },
    //   { title: 'PPM', component: PpmPageModule, icon: 'fa fa-cogs' },
    //   { title: 'Escalation', component: EscalationPage, icon: 'fa fa-check-square-o' },
    //   { title: 'Task Management ', component: TaskManagementPage, icon: 'fa fa-tasks' },
    //   { title: 'Comments', component: CommentsToCommentsPage, icon: 'fa fa-comment' },
    //   { title: 'Notification', component: NotificationPage, icon: 'fa fa-bell' },
    //   { title: 'Hoto', component: HotoPage, icon: 'fa fa-bell' },
    //   { title: 'Logout', component: null, icon: 'fa fa-sign-out fa-lg' }
    // ];


    this.events.subscribe('userloggedin', (() => {
      this.user = localStorage.getItem('userData');
      this.user = JSON.parse(this.user);
      this.userSurname = this.user.Surname;
    }));

    this.events.subscribe('useraccess', (() => {
      this.useraccessdata = localStorage.getItem('useraccessdata');
      this.useraccessdata = JSON.parse(this.useraccessdata);
      console.log('App-->', this.useraccessdata);

      this.pages = [];

      this.pages = [{ title: 'Dashboard ', component: DashboardPage, icon: 'fa  fa-tachometer fa-lg' }];

      if (this.useraccessdata.ASSET_DETAILS_ACCESS == 1) {
        this.pages.push({ title: 'Asset Detail', component: SearchPage, icon: 'fa  fa-barcode fa-lg' })
      }

      if (this.useraccessdata.CALL_MANAGEMENT_ACCESS == 1) {
        this.pages.push({ title: 'Call Management', component: CallmanagementPage, icon: 'fa fa-phone fa-lg' });
      }

      if (this.useraccessdata.COMMENTS_ACCESS == 1) {
        this.pages.push({ title: 'Comments', component: CommentsToCommentsPage, icon: 'fa fa-comment' });
      }

      if (this.useraccessdata.ESCALATION_ACCESS == 1) {
        this.pages.push({ title: 'Escalation', component: EscalationPage, icon: 'fa fa-check-square-o' });
      }

      if (this.useraccessdata.HOTO_ACCESS == 1) {
        this.pages.push({ title: 'Hoto', component: HotoPage, icon: 'fa fa-bell' });
      }

      if (this.useraccessdata.INVENTORY_ACCESS == 1) {
        this.pages.push({ title: 'Inventory', component: InventoryPage, icon: 'fa fa-cubes fa-lg' });
      }

      if (this.useraccessdata.LPO_ACCESS == 1) {
        this.pages.push({ title: 'LPO', component: lpoPageModule, icon: 'fa fa-shopping-cart' });
      }

      if (this.useraccessdata.NOTIFICATION_ACCESS == 1) {
        this.pages.push({ title: 'Notification', component: NotificationPage, icon: 'fa fa-bell' });
      }

      if (this.useraccessdata.PARKING_ACCESS == 1) {
        this.pages.push({ title: 'Parking', component: ParkingPage, icon: 'fa fa-car' });
      }

      if (this.useraccessdata.PPM_ACCESS == 1) {
        this.pages.push({ title: 'PPM', component: PpmPageModule, icon: 'fa fa-cog' });
      }

      if (this.useraccessdata.RECEIPT_LIST_ACCESS == 1) {
        this.pages.push({ title: 'Receipts', component: ReceiptPage, icon: 'fa fa-file-text fa-lg' });
      }

      if (this.useraccessdata.RESOURCE_ACCESS == 1) {
        this.pages.push({ title: 'Resource Manager', component: resourcemanagerPage, icon: 'fa fa-cogs' });
      }

      if (this.useraccessdata.TASK_ACCESS == 1) {
        this.pages.push({ title: 'Task Management ', component: TaskManagementPage, icon: 'fa fa-tasks' });
      }

      this.pages.push({ title: 'Logout', component: null, icon: 'fa fa-sign-out fa-lg' });


    }));

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.rootPage = this.initPage();

      if (this.platform.is('ios')) {
        console.log('I am an iOS device!!');
        this.TokenSetup();
      }

      if (this.platform.is('android')) {
        console.log('I am an android device!!');
        this.TokenSetup();
      }

    });
  }

  // TokenSetup() {

  //   this.fcm.getToken().then((token) => {
  //     localStorage.setItem('token', token);
  //     console.log('app get Token ->' + token);
  //   }, (err) => {
  //     alert(JSON.stringify(err));
  //   });

  //   this.fcm.onNotification().subscribe((data) => {
  //     if (data.wasTapped) {
  //       console.log("Received in background");
  //       this.presentToast(data.body);
  //     } else {
  //       console.log("Received in foreground");
  //       this.presentToast(data.body);
  //     }
  //   }
  //   );

  //   // Updating token if it is updated
  //   this.fcm.onTokenRefresh().subscribe((token) => {
  //     localStorage.setItem('token', token);
  //     console.log('app Token Refresh ->' + token);
  //   });

  // }

  TokenSetup() {

    this.fcm.getToken().then((token) => {
            localStorage.setItem('token', token);
        }, (err) => {
    });

    this.fcm.onNotification().subscribe((data) => {
      console.log('Notification received app.js ....');
      debugger;

      if (data.wasTapped) {

        if (data.trans_type == "TMS") {
          let user = localStorage.getItem('userData');
          this.user = JSON.parse(user || null);
          if (this.user.UserInfoId > 0) {
            this.SearchTaskDetail(data.seq_text);
          }
        }

        if (data.trans_type == 'TASK AUDIO') {
          if (this.user.UserInfoId > 0) {
            this.openTaskCommentModal(data.roi_comments_id, data.payment_details);
          }
        }
        

      } else {
        console.log("Received in foreground");

        if (data.trans_type == "TMS") {
          this.presentToastWithEvent(data.body, data);
        }else if (data.trans_type == "TASK AUDIO") {
          this.presentToastForTaskComment(data.body, data);
        }
        
      }
    }
    );

    this.fcm.onTokenRefresh().subscribe((token) => {
      localStorage.setItem('token', token);
    });

  }

  presentToastWithEvent(msg, data) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "TMS") {
          this.SearchTaskDetail(data.seq_text);
        }
      }
    });

    toast.present();

  }

  SearchTaskDetail(SEQ_TEXT: any) {
    debugger;
    let task_val = SEQ_TEXT;
    if (task_val != '') {
      let data = {
        SearchData: SEQ_TEXT,
        UserInfoId: this.user.UserInfoId
      }
      this.presentLoadingDefault(true);
      this.authService.postData(data, 'task/TaskManagementSearch').then((result) => {
        this.tasksearchlist = result;
        this.presentLoadingDefault(false);
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };

        this.myModalData = [
          this.tasksearchlist,
          'Search',
          task_val
        ];

        let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: this.myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {

        });
        myModal.onWillDismiss((data) => {
        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }

  }

  openTaskCommentModal(ID: any, TASK_DETAILS: any) {

    let TASK_DETAIL = TASK_DETAILS ? JSON.parse(TASK_DETAILS) : null;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: ID,
      task_data_val: TASK_DETAIL
    }];

    let myModal: Modal = this.modal.create('TaskCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onWillDismiss(() => {
    });

  }

  presentToastForTaskComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "TASK AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openTaskCommentModal(data.roi_comments_id, data.payment_details);
          }
        }
      }
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


  presentToast(msg) {
    let toast = this.toastCtrl.create({

      message: msg,
      duration: 5000,
      position: 'top',
      cssClass: 'normalToast',

    });
    toast.present();
  }


  openPage(page) {
    debugger;
    if (page.component) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
    } else {
      // Since the component is null, this is the logout option
      // ...
      // logout logic
      // ...
      localStorage.clear();
      // redirect to home
      this.nav.setRoot(LoginPage);
    }
  }

  initPage() {
    let user = localStorage.getItem('userData');
    let storedvalue = localStorage.getItem('RememberMe');
    this.user = JSON.parse(JSON.stringify(user || null));
    this.RememberMe = JSON.parse(JSON.stringify(storedvalue || null));
    if (this.RememberMe) {
      return DashboardPage;
    } else {
      return LoginPage; //DashboardPage;
    }
  }
}
