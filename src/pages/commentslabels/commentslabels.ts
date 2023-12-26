import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-commentslabels',
  templateUrl: 'commentslabels.html',
})
export class CommentsLabelsPage {
  CmtData = {
    CmtLPO: [] as any,
    CmtINVENTORY: [] as any,
    CmtCS: [] as any,
    CmtCPR: [] as any,
    CmtRCS: [] as any,
    CmtHOTO: [] as any,
    CmtDREC: [] as any,
    CmtCM: [] as any,
    MyDataall: [] as any
  } as any;

  CmtCallMgntList = {
    GetAllCallMgnt: [] as any
  } as any;

  CmtlpoList = {
    GetAllLPO: [] as any
  } as any;

  CmtinventoryList = {
    GetAllinventory: [] as any
  } as any;

CallMgntcommentsdetailsall = {
    MyComments: [] as any,
    MyCommentToComments: [] as any,
    MyCommentsList: [] as any
} as any;

LPOcommentsdetailsall = {
  MyComments: [] as any,
  MyCommentToComments: [] as any,
  MyCommentsList: [] as any
} as any;

  commentsData = this.navParams.get('data');
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');

  LPO_Comments_display = 'none';
  INVENTORY_Comments_display = 'none';
  Cheque_Comments_display = 'none';
  PaymentReq_Comments_display = 'none';
  ReturnCheque_Comments_display = 'none';
  Hoto_Comments_display = 'none';
  CallMgnt_Comments_display = 'none';
  Drec_Comments_display = 'none';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
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

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  closeModal() {
    this.view.dismiss();
  }

  returndetails() {
    let myTitle = 'Comments';
    let paramdata = {
      UserInfoId: this.user.UserInfoId,
      type: this.commentsData[0].type
    };
    this.presentLoadingDefault(true);
    this.authService.postData(paramdata, 'comments/CommentsLabelSummary').then((result) => {
      this.CmtData = result;
      this.presentLoadingDefault(false);
      console.log(this.CmtData);
      console.log(this.CmtData.MyDataall);
      if (this.CmtData.MyDataall.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  ionViewDidLoad() {
    this.returndetails();
  }

  setDisplaydata(display_type: any) {

    if(display_type == 'My CallMgnt Comments') {
      this.GetCallMgntList(this.commentsData[0].type);
      this.LPO_Comments_display = 'none';
      this.INVENTORY_Comments_display = 'none';
      this.Cheque_Comments_display = 'none';
      this.PaymentReq_Comments_display = 'none';
      this.ReturnCheque_Comments_display = 'none';
      this.Hoto_Comments_display = 'none';
      this.CallMgnt_Comments_display = 'block';
      this.Drec_Comments_display = 'none';

    }else if(display_type == 'My LPO Comments'){
      this.GetLPOtList(this.commentsData[0].type);
      this.LPO_Comments_display = 'block';
      this.INVENTORY_Comments_display = 'none';
      this.Cheque_Comments_display = 'none';
      this.PaymentReq_Comments_display = 'none';
      this.ReturnCheque_Comments_display = 'none';
      this.Hoto_Comments_display = 'none';
      this.CallMgnt_Comments_display = 'none';
      this.Drec_Comments_display = 'none';
    }else if(display_type == 'My INVENTORY Comments'){
      this.Get_INVENTORY_List(this.commentsData[0].type);
      this.LPO_Comments_display = 'none';
      this.INVENTORY_Comments_display = 'block';
      this.Cheque_Comments_display = 'none';
      this.PaymentReq_Comments_display = 'none';
      this.ReturnCheque_Comments_display = 'none';
      this.Hoto_Comments_display = 'none';
      this.CallMgnt_Comments_display = 'none';
      this.Drec_Comments_display = 'none';
    }

  }
  GetCallMgntList(LABEL_TYPE: any) {
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsCallMgntList').then((result) => {
      this.CmtCallMgntList = result;
      this.presentLoadingDefault(false);
      console.log('ChqComment', this.CmtCallMgntList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }
  GetLPOtList(LABEL_TYPE: any){
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsLpoList').then((result) => {
      this.CmtlpoList = result;
      this.presentLoadingDefault(false);
      console.log('LPOComment', this.CmtlpoList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  Get_INVENTORY_List(LABEL_TYPE: any){
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsinventoryList').then((result) => {
      this.CmtinventoryList = result;
      this.presentLoadingDefault(false);
      console.log('InventoryComment', this.CmtinventoryList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
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

    myModal.onDidDismiss((data) => {
      // console.log("I have dismissed.");
      // console.log(data);
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
    });
  }

  openLPOModal(LABEL_ID: any, STATUS_NAME: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LABEL_ID: LABEL_ID
    }];

    let myModal: Modal = this.modal.create('Lpomodelcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      // console.log("I have dismissed.");
      // console.log(data);
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
    });
  }

  // Call Management Comment data extend//
  showCallMgntCmtBtn = -1;
  isCallMgntCmtOpen = false;
  oldCallMgntCmtBtn = -1;
  showcallCommentUndoBtn(index, CALL_LOG_ID: any) {

      this.GetCallManagementComment(CALL_LOG_ID, this.commentsData[0].type);

      if (this.isCallMgntCmtOpen == false) {
          this.isCallMgntCmtOpen = true;
          this.oldCallMgntCmtBtn = index;
          this.showCallMgntCmtBtn = index;
      } else {
          if (this.oldCallMgntCmtBtn == index) {
              this.isCallMgntCmtOpen = false;
              this.showCallMgntCmtBtn = -1;
              this.oldCallMgntCmtBtn = -1;
          } else {
              this.showCallMgntCmtBtn = index;
              this.oldCallMgntCmtBtn = index;
          }
      }
  }

    // LPO Comment data extend//
    showLPOCmtBtn = -1;
    islpoOpen = false;
    oldlpoCmtBtn = -1;
    showlpoCommentUndoBtn(index, LPO_ID: any) {
  
        this.GetLPOComment(LPO_ID, this.commentsData[0].type);
  
        if (this.islpoOpen == false) {
            this.islpoOpen = true;
            this.oldlpoCmtBtn = index;
            this.showLPOCmtBtn = index;
        } else {
            if (this.oldlpoCmtBtn == index) {
                this.islpoOpen = false;
                this.showLPOCmtBtn = -1;
                this.oldlpoCmtBtn = -1;
            } else {
                this.showLPOCmtBtn = index;
                this.oldlpoCmtBtn = index;
            }
        }
    }

//// CAll Management Comment List ////

GetCallManagementComment(CALL_LOG_ID: any, LABEL_TYPE: any) {

    this.presentLoadingDefault(true);

    let userdata = {
        UserInfoId: this.user.UserInfoId,
        UserEmployeeId: this.user.UserEmployeeId,
        call_log_id: CALL_LOG_ID,
        label_type: LABEL_TYPE
    }

    this.authService.postData(userdata, 'comments/CallMgntCommentsListByID').then((result) => {
        this.CallMgntcommentsdetailsall = result;
        this.presentLoadingDefault(false);
        console.log('CallMgnt', this.CallMgntcommentsdetailsall);
    }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
    });
}

GetLPOComment(LPO_ID: any, LABEL_TYPE: any){
  let userdata = {
    UserInfoId: this.user.UserInfoId,
    UserEmployeeId: this.user.UserEmployeeId,
    LPO_ID: LPO_ID,
    label_type: LABEL_TYPE
}

this.authService.postData(userdata, 'comments/LPOCommentsListByID').then((result:any) => {
    this.LPOcommentsdetailsall =result;
    this.presentLoadingDefault(false);
    console.log('LPO', this.LPOcommentsdetailsall);
}, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
});
}

}
