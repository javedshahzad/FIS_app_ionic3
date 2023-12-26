import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { Constant } from '../../providers/constant/constant'

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hoto',
  templateUrl: 'hoto.html'
})
export class HotoPage {
  isListShow:any=0;
  hotoDetailsall: any;
  listData:any;
  leaseHotoData: any =[];
  pendingPMApprovalData: any =[];
  pendingFMApprovalData: any =[];
  pendingUploadHOTOFormData: any =[];
  pendingForLeaseTOData: any =[];
  mainWorkInProgressData: any =[];
  escalationToCEOData: any =[];
  insertedValues: any;
  searchData = { "search_value": "" };
  hotodetailssearch: any;
  leaseAppointmentStatus:any;
  user: any = localStorage.getItem('userData');  
  resourcedetails: any = localStorage.getItem('resourseData');  
  resource_type_id:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController,public constant:Constant) {
    this.user = this.user ? JSON.parse(this.user) : {};   
    this.leaseAppointmentStatus = this.constant.leaseAppointmentStatus;
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};
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
    if(this.isListShow ==1)
      this.isListShow=0;
    else
      this.navCtrl.setRoot(DashboardPage);
  }

  hotoDetails() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'hoto/HotoList').then((result) => {
      this.hotoDetailsall = result;
      this.leaseHotoData = this.hotoDetailsall.HOTOListData;
      this.pendingPMApprovalData = this.hotoDetailsall.pendingPMApprovalData;
      this.pendingFMApprovalData = this.hotoDetailsall.pendingFMApprovalData;
      this.pendingUploadHOTOFormData = this.hotoDetailsall.pendingUploadHOTOFormData;
      this.pendingForLeaseTOData = this.hotoDetailsall.pendingForLeaseTOData;
      this.mainWorkInProgressData = this.hotoDetailsall.mainWorkInProgressData;
      this.escalationToCEOData = this.hotoDetailsall.escalationToCEOData;
      this.hotodetailssearch = this.leaseHotoData;
      this.listData = this.leaseHotoData;
      console.log(this.hotoDetailsall);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }
  
  ionViewDidLoad() {    
    this.resource_type_id = this.resourcedetails.TYPE_ID;
    console.log('Resource Type: ',this.resource_type_id);
    this.hotoDetails();
  }

  openModal(LEASE_NUM: any, HANDOVER_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUM: LEASE_NUM,
      HOTO_ID: HANDOVER_ID
    }];

    let myModal: Modal = this.modal.create('HotoCommentPage', { data: myModalData }, myModalOptions);

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

  GetDataList(ListType){
    this.isListShow =1;
    switch (ListType) {
      case 'PPMMA' :
        this.listData = this.pendingPMApprovalData;
        break;
      case 'PFMMA':
        this.listData = this.pendingFMApprovalData;
        break;
      case 'PUHOTOF' :
        this.listData = this.pendingUploadHOTOFormData;
        break;
      case 'PLTO':
        this.listData = this.pendingForLeaseTOData;
        break;
      case 'MWIP' :
        this.listData = this.mainWorkInProgressData;
        break;
      case 'ESCTOCEO':
        this.listData = this.escalationToCEOData;
        break;
      default:
        this.listData = this.leaseHotoData;
    }
  }

  SearchhotoDetail() {
    let hoto_val = this.searchData.search_value;
    if (hoto_val != '') {
      this.hotoDetailsall = this.hotodetailssearch.filter(item => (item.LEASE_NUMBER ? item.LEASE_NUMBER.includes(hoto_val) : '') || (item.UNIT ? item.UNIT.includes(hoto_val) : '') || (item.TENANT_NAME ? item.TENANT_NAME.includes(hoto_val) : ''));
    } else {
      this.hotoDetailsall = this.hotodetailssearch
    }
  }

  openAttachment(HANDOVER_ID:any,LEASE_NUMBER:any){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
  
    let  myModalData = [{
      LEASE_NUMBER: LEASE_NUMBER,
      HANDOVER_ID:HANDOVER_ID
    }];
  
    let myModal: Modal = this.modal.create('HotoattachmentPage', { data: myModalData }, myModalOptions);
  
    myModal.present();
  
  
    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
      // console.log("I'm about to dismiss");
      // console.log(data);
    });
  }

  UpdateAppointmentStatus(LEASE_NUMBER:any,ENABLE_STATUS:any,HANDOVER_ID:any,HOTODETAILS:any){

    if(ENABLE_STATUS == 0) {
      //this.presentToast(TOOL_TIP);
      return;

  } else {

      const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
      };

      let myModalData = [{
          HOTODETAILS: HOTODETAILS,
          LEASE_NUMBER: LEASE_NUMBER,
          HANDOVER_ID: HANDOVER_ID
      }];

      let myModal: Modal = this.modal.create('HotoUpdateStatusPage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onWillDismiss(() => {
          this.ionViewDidLoad();
      });
  }

  }

}
