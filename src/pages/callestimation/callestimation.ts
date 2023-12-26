import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { estimationoption } from '../estimationoption/estimationoption';
import { CallmanagementPage } from '../callmanagement/callmanagement';
import Swal from 'sweetalert2';
import { CreateTaskPage } from '../createtask/createtask';
/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-callestimation',
  templateUrl: 'callestimation.html',
})
export class callestimationpage {
  lpocommentsdetails:any
  createcallForm:FormGroup;
  createcallForm1:FormGroup;
  reSchedulecallForm:FormGroup;
  createcallForm2:FormGroup;
    insertedValues: any;
    calldata:any;
    CallinspectionList:any;
    callestimationdetails:any;
    Callestimationvalue:any;
    CallInspectionData:any;
    ASSIGNED_TO_IDworklist:any;
    Assign_Approverdata:any;
    confirmation:any;
    STATUS_NAME_data:any;
    CALL_LOG_ID_data:any;
    CALL_ESTIMATION_ID_data:any;
    callinspectionlabour:any;
    TOTAL_data:any;
    file_name:any= [];
    size:any= [];
    imageURI:any= [];
    image_dout_liststyle ='none';
    image_dout_liststyle1 ='none';
    image_dout_liststyle2 ='none';
    reschedule_divstyle ='none';
    ResourseList:any;
    rejectbtn_approvebtn_show = 'none';
    edit_show = 'none';
    Lpomanament:any;
    Callestimation = this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    searchData = {"search_value": ""};
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,private modal: ModalController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};  
            this.createcallForm = this.formBuilder.group({
              Assigned_to: ['', Validators.compose([Validators.required])],
              comments: ['', Validators.compose([Validators.required])],
              Call_No: ['', Validators.compose([Validators.required])],
              CALL_ESTIMATION_ID: ['', Validators.compose([Validators.required])],
              STATUS_NAME: ['', Validators.compose([Validators.required])]
            });

            this.createcallForm1 = this.formBuilder.group({
              Assigned_to: [''],
              comments: ['', Validators.compose([Validators.required])],
              Call_No: ['', Validators.compose([Validators.required])],
              CALL_ESTIMATION_ID: ['', Validators.compose([Validators.required])],
              STATUS_NAME: ['', Validators.compose([Validators.required])]
            });

            this.createcallForm2 = this.formBuilder.group({
              Call_No: ['', Validators.compose([Validators.required])],
              CALL_ESTIMATION_ID: ['', Validators.compose([Validators.required])],
              amount: [''],
              Oracle_Ivoice_No: [''],
              comments: ['', Validators.compose([Validators.required])]
            });

            this.reSchedulecallForm = this.formBuilder.group({
              Assigned_to: [''],
              COMMENTS: ['', Validators.compose([Validators.required])],
              CALL_LOG_ID: ['', Validators.compose([Validators.required])],
              CALL_ESTIMATION_ID: ['', Validators.compose([Validators.required])],
              STATUS_NAME: ['', Validators.compose([Validators.required])]
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
    this.Callestimationvalue = this.Callestimation[0].inspection;
    console.log(this.Callestimationvalue);
    this.GetAllresourse_list();

    if(this.Callestimation[0].type === "Open"){
      //this.edit_show = 'block';
    }
  }
  
  GetAllresourse_list(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'Lpo/Getallresourse/'+this.user.UserInfoId+'').then((result) => {
      this.presentLoadingDefault(false);
      this.ResourseList = result[0];
     // console.log('ResourseList',this.ResourseList);
      if(this.ResourseList.TYPE_USER === "Manager"){
        this.rejectbtn_approvebtn_show = 'block';
      }else if(this.ResourseList.TYPE_USER === "General Manager"){
        this.rejectbtn_approvebtn_show = 'block';
      }else if(this.ResourseList.TYPE_USER === "CEO"){
        this.rejectbtn_approvebtn_show = 'block';
       }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  openModalinspection(CALL_INSPECTION_ID:any,CALL_LOG_ID:any,STATUS_ID:any,ASSIGNEDID:any,typedata){
    
    this.presentLoadingDefault(true);
    let Inspectiondata = this.Callestimation[0].inspection.filter(call => call.CALL_INSPECTION_ID === CALL_INSPECTION_ID)
    let data ={
      CALL_INSPECTION_ID : CALL_INSPECTION_ID,
      CALL_NO : CALL_LOG_ID,
      STATUS_ID : STATUS_ID,
      ASSIGNEDID: ASSIGNEDID,
      modified_by :this.user.UserInfoId,
      created_by :this.user.UserInfoId};

  this.authService.postData(data,'Call_inspection/Callestimationdetails').then((result) => {
    this.presentLoadingDefault(false);
    this.callestimationdetails = result;
    if(this.callestimationdetails.length > 0){
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          CALL_ESTIMATION_DETAILS: this.callestimationdetails,
          Inspection: Inspectiondata,
          type : typedata,
          title : "Call Estimation Details"
          }];

        const myModal: Modal = this.modal.create('callestimationdetails', { data: myModalData }, myModalOptions);
    
        myModal.present();
    
        myModal.onDidDismiss((data) => {
         /* console.log("I have dismissed.");
          console.log(data); */
        });
    
        myModal.onWillDismiss((data) => {
         /* console.log("I'm about to dismiss");
          console.log(data);*/
        });     
      this.presentLoadingDefault(false);
    }else{
      this.presentToast(`No data found`);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast(`Something Went Wrong`);
  });
}

openModal(CALL_LOG_ID:any,STATUS_NAME:any,REQUESTOR_NAME:any) {

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
  /*  console.log("I have dismissed.");
    console.log(data); */
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
  onCloseimage_dout_list(){
    this.image_dout_liststyle ='none';
  }
  onCloseimage_dout_list1(){
    this.image_dout_liststyle1 ='none';
  }
  onCloseimage_dout_list2(){
    this.image_dout_liststyle2 ='none';
  }
  onCloseReschedule(){
    this.reschedule_divstyle ='none';
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
        this.Callestimationvalue = this.Callestimation[0].inspection.filter(call => (call.REQUESTOR_NAME ? call.REQUESTOR_NAME.includes(item):false));
      }else if(!isNaN(call_id)){
        this.Callestimationvalue = this.Callestimation[0].inspection.filter(call => call.CALL_LOG_ID === call_id);
      }
    }else{
      this.Callestimationvalue = this.Callestimation[0].inspection;
    }
  }

  confirmupdate(CALL_LOG_ID:any,STATUS_NAME:any,CALL_ESTIMATION_ID:any){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to Confirmated Data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Updated',
          'Your data is Confirmated.',
          'success'
        )
        let CallInspectionData = this.createcallForm.value;
        CallInspectionData.CALL_LOG_ID = CALL_LOG_ID;
        CallInspectionData.STATUS_NAME = STATUS_NAME;
        CallInspectionData.CALL_ESTIMATION_ID = CALL_ESTIMATION_ID;
        CallInspectionData.modified_by = this.user.UserInfoId;

        this.presentLoadingDefault(true);
        this.authService.postData(CallInspectionData,'Call_inspection/CallLog_Status_Change_estimation').then((result) => {
          this.navCtrl.setRoot(estimationoption);
          this.presentLoadingDefault(false);
          this.presentToast("Updated successfully");
         // console.log('List ',this.insertedValues);
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast("Something went to wrong, please try again later");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your data is not Confirmated)',
          'error'
        )
      }
    });
  }

  Assign_Approver(CALL_LOG_ID:any,STATUS_NAME:any,CALL_ESTIMATION_ID:any){
    this.CALL_LOG_ID_data = CALL_LOG_ID;
    this.STATUS_NAME_data = STATUS_NAME;
    this.CALL_ESTIMATION_ID_data = CALL_ESTIMATION_ID;
    this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/ASSIGNED_to_id/').then((result) => {
      this.ASSIGNED_TO_IDworklist = result;
      this.Assign_Approverdata = this.ASSIGNED_TO_IDworklist.filter(call => call.TYPE_USER === 'Manager' && call.IS_ACTIVE === 1);
      if(this.ASSIGNED_TO_IDworklist.length > 0){
        this.image_dout_liststyle ='block';
        var element = document.getElementById("accordionExample");
        setTimeout(()=>{element.scrollIntoView(true)},10); 
        this.presentLoadingDefault(false);
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  insertCallData(){
    this.presentLoadingDefault(true);
    let commentsForm = this.createcallForm.value;
    commentsForm.created_by= this.user.UserInfoId;
    commentsForm.modified_by= this.user.UserInfoId;
    this.authService.postData(commentsForm,'Call_inspection/confirmationinsertnot_mngr/').then((result) => {
      this.navCtrl.setRoot(estimationoption);
      this.confirmation = result;
      this.presentLoadingDefault(false);
      this.presentToast("Updated successfully");
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  Approve_the_Estimation(CALL_LOG_ID:any,STATUS_NAME:any,CALL_ESTIMATION_ID:any){
    this.CALL_LOG_ID_data = CALL_LOG_ID;
    this.STATUS_NAME_data = STATUS_NAME;
    this.CALL_ESTIMATION_ID_data = CALL_ESTIMATION_ID;
    this.image_dout_liststyle1 ='block';
    var element = document.getElementById("accordionExample");
    setTimeout(()=>{element.scrollIntoView(true)},10); 
  }
  
  Reschedule_the_Estimation(CALL_LOG_ID:any,STATUS_NAME:any,CALL_ESTIMATION_ID:any){
    this.CALL_LOG_ID_data = CALL_LOG_ID;
    this.STATUS_NAME_data = STATUS_NAME;
    this.CALL_ESTIMATION_ID_data = CALL_ESTIMATION_ID
    this.reschedule_divstyle ='block';
    var element = document.getElementById("accordionExample");
    setTimeout(()=>{element.scrollIntoView(true)},10); 
  }

  insertCallData1(){
    this.presentLoadingDefault(true);
    let commentsForm = this.createcallForm1.value;
    commentsForm.created_by= this.user.UserInfoId;
    commentsForm.modified_by= this.user.UserInfoId;
    this.authService.postData(commentsForm,'Call_inspection/confirmationinsert_app_esti/').then((result) => {
      this.navCtrl.setRoot(estimationoption);
      this.confirmation = result;
      this.presentLoadingDefault(false);
      this.presentToast("Updated successfully");
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  reScheduleCallData(){
    this.presentLoadingDefault(true);
    let commentsForm = this.reSchedulecallForm.value;
    commentsForm.STATUS_ID= 237; //ESTIMATION STATUS_ID
    commentsForm.INTERM_STATUS= 'INSPECTION IN PROGRESS';
    commentsForm.INTERM_STATUS_ID= 242;
    commentsForm.CUR_INTERM_STATUS= 'PENDING FOR MANAGER APPROVAL';
    commentsForm.CUR_INTERM_STATUS_ID= 248;
    commentsForm.REF_ID= commentsForm.CALL_ESTIMATION_ID;
    commentsForm.REF_TYPE= 2;
    commentsForm.USER_ID= this.user.UserInfoId;
    this.authService.postData(commentsForm,'Call_inspection/reshedule_call_estimation/').then((result) => {
      this.navCtrl.setRoot(estimationoption);
      this.confirmation = result;
      this.presentLoadingDefault(false);
      this.presentToast("Updated successfully");
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  Approve_the_client(COMPLAINT_ID:any,CALL_LOG_ID:any,CALL_ESTIMATION_ID:any){
    this.CALL_ESTIMATION_ID_data = CALL_ESTIMATION_ID;
    this.CALL_LOG_ID_data = CALL_LOG_ID;
    this.image_dout_liststyle2 ='block';
    var element = document.getElementById("accordionExample");
    setTimeout(()=>{element.scrollIntoView(true)},10); 
  }

  insertCallData2(){
    this.presentLoadingDefault(true);
    let commentsForm = this.createcallForm2.value;

    commentsForm.imageURI_data = this.imageURI;
    commentsForm.name = this.file_name;
    commentsForm.size_data = this.size;
    commentsForm.created_by= this.user.UserInfoId;
    commentsForm.modified_by= this.user.UserInfoId;
    this.authService.postData(commentsForm,'Call_inspection/confirmationinsert_app_client/').then((result) => {
      this.navCtrl.setRoot(CallmanagementPage);
      this.confirmation = result;
      this.presentLoadingDefault(false);
      this.presentToast("Updated successfully");
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  onSelectFile(event){
    let file = event.target.files;
    for(let i=0;i<file.length;i++){
      this.file_name.push(file[i].name);
    this.size.push(file[i].size);
     let reader = new FileReader();
     reader.readAsDataURL(file[i]);
     reader.onloadend = (e) => {
       this.imageURI.push(reader.result);
     };
     reader.onerror = function (error) {
       /* console.log('Error: ', error); */
     };
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