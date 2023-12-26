import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import Swal from 'sweetalert2'
import { workassignmentoption } from '../workassignmentoption/workassignmentoption';
import { IonicSelectableComponent } from 'ionic-selectable';
/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-callworkassignmentdetails',
  templateUrl: 'callworkassignmentdetails.html',
})
export class callworkassignmentdetails {
  CALL_LOG_ID = '';
  calinspectioncommentsForm:FormGroup;
  callinventoryininsert:FormGroup;
  createcallForm:FormGroup;
  fileuploadForm:FormGroup;
  workasslist:any;
  commentlist:any;
  ITEM_IDdata:any;
  comment ='none';
  WorkOrder1 ='none';
  comment1 ='none';
  image_dout_liststyle ='none';
  image ='none';
  TASKASSIGNMENT_IDdata:any
  insertedValuesinventory:any;
  ASSIGNED_TO_IDdata:any;
  STATUSdata:any;
  itemdatavalue=[] as any;
  ASSIGNED_TO_IDworklist:any;
  statusworklist:any;
  CALL_LOG_ID_data:any;
  TaskAssignment_data:any;
  statuslist:any;
  file_name:any;
  size:any;
  formData:any;
  imageURI:any;
  userdata:any;
  STATUS_ID:any;
  callcomplientsdetails:any;
  call_create_details:any;
  callworkassignmentdetails = this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};
       

            this.calinspectioncommentsForm = this.formBuilder.group({
              comments_show: ['', Validators.compose([Validators.required])],
              comments: ['', Validators.compose([Validators.required])],
              ITEM_ID: ['', Validators.compose([Validators.required])],
              TASK_ID: ['', Validators.compose([Validators.required])]
            });
            
            this.callinventoryininsert = this.formBuilder.group({
              ITEM_ID: ['', Validators.compose([Validators.required])],
              ASSIGNED_TO_ID: ['', Validators.compose([Validators.required])],
              CALLLOG_COMPLAINT_ID: ['', Validators.compose([Validators.required])],
              TASKASSIGNMENT_ID: ['', Validators.compose([Validators.required])],
              STATUS_ID: ['', Validators.compose([Validators.required])],
              Call_No: ['', Validators.compose([Validators.required])],
              Remarks: ['', Validators.compose([Validators.required])],
              Requestor_Name: ['', Validators.compose([Validators.required])],
              Mobile_no: ['', Validators.compose([Validators.required])],
              Unit_Code: ['', Validators.compose([Validators.required])],
              Complaint: ['', Validators.compose([Validators.required])],
              total: ['', Validators.compose([Validators.required])],
              Assigned_to: ['', Validators.compose([Validators.required])],
              Status: ['', Validators.compose([Validators.required])],
              comments: ['', Validators.compose([Validators.required])]
            }); 
            this.createcallForm = this.formBuilder.group({
              Assigned_to: ['', Validators.compose([Validators.required])],
              comments: ['', Validators.compose([Validators.required])],
              Call_No: ['', Validators.compose([Validators.required])],
              TaskAssignment: ['', Validators.compose([Validators.required])],
              Status: ['', Validators.compose([Validators.required])]
            });
            this.fileuploadForm = this.formBuilder.group({
              Job_Card_Number: ['', Validators.compose([Validators.required])],
              comments: ['', Validators.compose([Validators.required])],
              Call_No: ['', Validators.compose([Validators.required])],
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
  ngOnInit() {
    this.workassignmentdetailslist();
    this.ASSIGNED_TO_ID();
    this.STATUS();
    this.getcallCompliantdetails(this.callworkassignmentdetails[0].CALL_LOG_ID);
    this.call_create_details = this.callworkassignmentdetails[0].Inspectiondata[0];
    console.log(this.callworkassignmentdetails);
   }
   onCloseHandledcomment(){
    this.comment ='none';
  }
  onCloseHandledcomment1(){
    this.comment1 ='none';
  }
  onCloseHandle(){
    this.WorkOrder1 ='none';
  }
  onCloseimage_dout_list(){
    this.image_dout_liststyle ='none';
  }
  onCloseimage(){
    this.image ='none';
  }
  getcallCompliantdetails(CALL_LOG_ID){
    this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/CallCompliantdetails/'+CALL_LOG_ID+'').then((result) => {
      this.presentLoadingDefault(false);
      this.callcomplientsdetails = result;
        this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(`Something Went Wrong`);
    });
  }
  ASSIGNED_TO_ID(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/procurementASSIGNED_TO_ID/'+this.callworkassignmentdetails[0].CALL_LOG_ID+'').then((result) => {
      this.ASSIGNED_TO_IDworklist = result;
      if(this.ASSIGNED_TO_IDworklist.length > 0){
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }
  STATUS(){
    let statusval = 4;
    this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/procurementstatus/'+statusval+'').then((result) => {
      this.statusworklist = result;
      if(this.statusworklist.length > 0){
      }else{
        this.presentLoadingDefault(false);
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
      position:'middle'
    });
    toast.present();
  }
  closeModal() {
    this.view.dismiss();
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
workassignmentdetailslist(){
  this.presentLoadingDefault(true);
  let commentsForm = this.calinspectioncommentsForm.value;
  commentsForm.CALL_LOG_ID= this.callworkassignmentdetails[0].CALL_LOG_ID;
  commentsForm.STATUS= this.callworkassignmentdetails[0].STATUS_ID;
  commentsForm.created_by= this.user.UserInfoId;
  commentsForm.modified_by= this.user.UserInfoId;
  this.authService.postData(commentsForm,'Call_inspection/workasslist/').then((result) => {
    this.workasslist = result;
    this.presentLoadingDefault(false);
    if(this.workasslist.length > 0){
      this.presentLoadingDefault(false);
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
}
commentsget(CALL_LOG_ID:any,STATUS:any,TASKASSIGNMENT_ID:any){
  let commentsForm = this.calinspectioncommentsForm.value;
  commentsForm.CALL_LOG_ID= CALL_LOG_ID;
  commentsForm.STATUS= STATUS;
  this.authService.postData(commentsForm,'Call_inspection/procurementcommentlist/').then((result) => {
    this.commentlist = result;
    this.ITEM_IDdata = CALL_LOG_ID;
    this.TASKASSIGNMENT_IDdata = TASKASSIGNMENT_ID;
    this.presentLoadingDefault(false);
    if(this.commentlist.length > 0){
      this.presentLoadingDefault(false);
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
this.comment ='block';
}


insertcomments(){
  let commentsForm = this.calinspectioncommentsForm.value;
  commentsForm.created_by= this.user.UserInfoId;
  commentsForm.modified_by= this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(commentsForm,'Call_inspection/Callworkcommentsinsertdata').then((result) => {
      this.presentLoadingDefault(false);

      this.presentToast("Comments successfully created");
      this.insertedValuesinventory = result;
     this.comment ='none';
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
}
addeditget(CALL_LOG_ID:any,STATUS:any,ASSIGNED_TO_ID:any,item:any){
  let commentsForm = this.calinspectioncommentsForm.value;
  commentsForm.CALL_LOG_ID= CALL_LOG_ID;
  commentsForm.STATUS= STATUS;
  this.itemdatavalue = item;
  this.authService.postData(commentsForm,'Call_inspection/procurementcommentlist/').then((result) => {
    this.commentlist = result;
    this.ITEM_IDdata = CALL_LOG_ID;
    this.ASSIGNED_TO_IDdata = ASSIGNED_TO_ID;
    this.STATUSdata = STATUS;
    this.presentLoadingDefault(false);
    if(this.commentlist.length > 0){
      this.presentLoadingDefault(false);
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
this.WorkOrder1 ='block';
}
Comments_History(CALL_LOG_ID:any,STATUS:any,TASKASSIGNMENT_ID:any){
  let commentsForm = this.calinspectioncommentsForm.value;
  commentsForm.CALL_LOG_ID= CALL_LOG_ID;
  commentsForm.STATUS= STATUS;
  this.authService.postData(commentsForm,'Call_inspection/procurementcommentlist/').then((result) => {
    this.commentlist = result;
    this.presentLoadingDefault(false);
    if(this.commentlist.length > 0){
      this.presentLoadingDefault(false);
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
this.comment1 ='block';
}
insertinventory(){
  this.presentLoadingDefault(true);
  let commentsForm = this.callinventoryininsert.value;
  commentsForm.Assigned_to= this.userdata;
  commentsForm.Status= this.STATUS_ID;
  commentsForm.created_by= this.user.UserInfoId;
  commentsForm.modified_by= this.user.UserInfoId;
  this.authService.postData(commentsForm,'Call_inspection/procurementeditupdate/').then((result) => {
    this.commentlist = result;
    this.presentLoadingDefault(false);
    if(this.commentlist.length > 0){
      this.presentLoadingDefault(false);
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
this.WorkOrder1 ='none';
}
update_task_mat(CALLLOG_ID:any,CALLLOG_COMPLAINT_ID:any){
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
      let commentsForm = this.callinventoryininsert.value;
      commentsForm.CALL_LOG_ID = CALLLOG_ID;
      commentsForm.CALLLOG_COMPLAINT_ID = CALLLOG_COMPLAINT_ID;
      commentsForm.is_mat_rcvd = 1;
      this.presentLoadingDefault(true);
      this.authService.postData(commentsForm,'Call_inspection/Callupdate_task_mat').then((result) => {
        this.presentLoadingDefault(false);
        this.presentToast("Updated successfully");
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
get_assi_sts(CALLLOG_ID:any){
  this.image_dout_liststyle ='block';
  this.CALL_LOG_ID_data = CALLLOG_ID;
  this.TaskAssignment_data = this.workasslist[0].TASKASSIGNMENT_ID;
  this.authService.getData({},'Call_inspection/ASSIGNED_to_id_engg/'+CALLLOG_ID+'').then((result) => {
    this.ASSIGNED_TO_IDworklist = result;
    if(this.ASSIGNED_TO_IDworklist.length > 0){
      
      this.presentLoadingDefault(false);
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });

  this.authService.getData({},'Call_inspection/procurementstatus/'+4+'').then((result) => {
    this.statuslist = result;
    if(this.statuslist.length > 0){
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
  let commentsForm = this.createcallForm.value;
  commentsForm.Assigned_to= this.userdata;
 // commentsForm.Status= this.STATUS_ID;
   commentsForm.STATUS_NAME = commentsForm.Status.STATUS_NAME;
   commentsForm.STATUS_ID = commentsForm.Status.STATUS_ID;
  
  if(commentsForm.STATUS_NAME == 'WORK COMPLETED'){
    this.image ='block';
    this.image_dout_liststyle ='none';
  }
  if( commentsForm.STATUS_ID != 0 && this.createcallForm.value.Assigned_to != 0){
  this.presentLoadingDefault(true);
  this.authService.postData(commentsForm,'Call_inspection/statusupdate').then((result) => {
    this.presentLoadingDefault(false);
    this.presentToast("Updated successfully");
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
  });
}else{
  this.presentToast("Status and Assigned To any one select");
}
}
insertfileData(){
  let fileuploadForm = this.fileuploadForm.value;
  fileuploadForm.modified_by= this.user.UserInfoId;
  fileuploadForm.imageURI_data = this.imageURI;
  fileuploadForm.name = this.file_name;
  fileuploadForm.size_data = this.size;
  fileuploadForm.created_by= this.user.UserInfoId;
  fileuploadForm.modified_by= this.user.UserInfoId;
  this.presentLoadingDefault(true);
  this.authService.postData(fileuploadForm,'Call_inspection/fileupdate').then((result) => {
    this.navCtrl.setRoot(workassignmentoption);
    this.presentLoadingDefault(false);
    this.presentToast("Updated successfully");
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
  });
}
onSelectFile(event){
  let file = event.target.files[0];
  this.file_name = file.name;
  this.size = file.size;
   let reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onloadend = (e) => {
     this.imageURI = reader.result;
   };
   reader.onerror = function (error) {
   };
}
userChange(event: {
  component: IonicSelectableComponent,
  value: any 
}) {
  this.userdata = event.value.RESOURCE_ID;
}
statusChange(event: {
  component: IonicSelectableComponent,
  value: any 
}) {
  this.STATUS_ID = event.value.STATUS_ID;
}
}