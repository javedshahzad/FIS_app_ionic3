import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { workcompletedoption } from '../../pages/workcompletedoption/workcompletedoption'
import { CreateTaskPage } from '../createtask/createtask';
/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-closed',
  templateUrl: 'closed.html',
})
export class closedpage {
  lpocommentsdetails:any
  ClosedForm:FormGroup
    insertedValues: any;
    calldata:any;
    CallinspectionList:any;
    callbillingdetails:any;
    Callestimationvalue:any;
    CALL_LOG_ID_data:any;
    closed_style = 'none';
    Lpomanament:any;
    Callbilling = this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    searchData = {"search_value": ""};
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,private modal: ModalController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};  
            this.ClosedForm = this.formBuilder.group({
              CALL_LOG_ID: ['', Validators.compose([Validators.required])],
              comments: ['', Validators.compose([Validators.required])],
            });
    }

  loading = this.loadingCtrl.create(); 
  presentLoadingDefault(show) { 
    if(!this.loading){
      this.loading = this.loadingCtrl.create(); 
    }  
    if(show){
      this.loading.present();
    }
    else{
      this.loading.dismissAll();
      this.loading =null
    }
  };

  ionViewWillLoad() {
    this.Callestimationvalue =this.Callbilling[0].inspection;
  }
  onCloseimage(){
    this.closed_style = 'none';
  }
  closedchange(CALL_LOG_ID:any){
    this.CALL_LOG_ID_data = CALL_LOG_ID;
    this.closed_style = 'block';
  }
  statuschange(){
    this.presentLoadingDefault(true);
    let commentsForm = this.ClosedForm.value;
    commentsForm.created_by= this.user.UserInfoId;
    commentsForm.modified_by= this.user.UserInfoId;
    this.authService.postData(commentsForm,'Call_inspection/closedstatuschange/').then((result) => {
      this.navCtrl.setRoot(workcompletedoption);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

openModal(CALL_LOG_ID:any,STATUS_NAME:any,REQUESTOR_NAME) {

  const myModalOptions: ModalOptions = {
    enableBackdropDismiss: false
  };

  const myModalData = [{
    CALL_LOG_ID: CALL_LOG_ID,
    STATUS_NAME:STATUS_NAME,
    REQUESTOR_NAME : REQUESTOR_NAME
  }];

  const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);

  myModal.present();

  myModal.onDidDismiss((data) => {
    console.log("I have dismissed.");
    console.log(data);
  });

}

  showBtn=-1;
  isOpen=false;
  oldBtn=-1;
showUndoBtn(index){
  if(this.isOpen=false){
    this.isOpen=true;
    this.oldBtn=index;
    this.showBtn=index;
  }else {
    if(this.oldBtn == index){
      this.isOpen=false;    
      this.showBtn=-1;
      this.oldBtn=-1;
    } else {
      this.showBtn=index;
      this.oldBtn=index;
    }
  }
}
  resetForm(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }
  closeModal() {
    this.view.dismiss();
  }

  SearchcallManagement(){
    let call_id = parseInt(this.searchData.search_value);
    let item =this.searchData.search_value;
    if(item !=''){
      if(isNaN(call_id)){
        this.Callestimationvalue = this.Callbilling[0].inspection.filter(call => (call.REQUESTOR_NAME ? call.REQUESTOR_NAME.includes(item):false));
      }else if(!isNaN(call_id)){
        this.Callestimationvalue = this.Callbilling[0].inspection.filter(call => call.CALL_LOG_ID === call_id);
      }
    }else{
      this.Callestimationvalue = this.Callbilling[0].inspection;
    }
  }
  openModalLpo(CALL_LOG_ID){
    let data ={
      CALL_LOG_ID:CALL_LOG_ID,
     }
      this.presentLoadingDefault(true);
      this.authService.postData(data,'Lpo/Get_lpoList_by_Call_log').then((result:any) => {
        console.log(result);
        this.Lpomanament = result;
        if(result.length > 0){
          if(this.Lpomanament[0].STATUS_ID === 1 && this.Lpomanament[0].NEXT_APPROVAL_TYPE === 1){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 1),
              type : 'Manager'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          }else if(this.Lpomanament[0].STATUS_ID === 1 && (this.Lpomanament[0].NEXT_APPROVAL_TYPE === 9 || this.Lpomanament[0].NEXT_APPROVAL_TYPE === 13)){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 1 && (call.NEXT_APPROVAL_TYPE === 9 || call.NEXT_APPROVAL_TYPE === 13)),
              type : 'Finance-MGR'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          }else if(this.Lpomanament[0].STATUS_ID === 1 && this.Lpomanament[0].NEXT_APPROVAL_TYPE === 23){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 23),
              type : 'General Manager'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
        
          }else if(this.Lpomanament[0].STATUS_ID === 3){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 3),
              type : 'COO'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          }else if(this.Lpomanament[0].STATUS_ID === 4){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 4),
              type : 'CEO'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          }else if(this.Lpomanament[0].STATUS_ID === 0 && this.Lpomanament[0].IS_REJECTED != 0){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 0 && call.IS_REJECTED != 0),
              type : 'Rejected'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          }else if(this.Lpomanament[0].STATUS_ID === 5){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 5),
              type : 'CEO_App'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
        }
        }else{
          this.presentToast("No Lpo data found");
        }
        this.presentLoadingDefault(false);
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
      });
  }

  createtask(CALL_LOG_ID,REQUESTOR_NAME,UNIT){
  
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      TASK_ID : -1,
      CALL_LOG_ID : CALL_LOG_ID,
      REQUESTOR_NAME : REQUESTOR_NAME,
      UNIT : UNIT
    }]

    const myModal: Modal = this.modal.create(CreateTaskPage, {data :mymodaldata},  myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
}

gettask(CALL_LOG_ID){
  let data={
    CALL_LOG_ID : CALL_LOG_ID,
    UserInfoId : this.user.UserInfoId
  }
  this.presentLoadingDefault(true);
  this.authService.postData(data,'Call_inspection/Get_tasklist_by_calllog').then((result:any) => {
    
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