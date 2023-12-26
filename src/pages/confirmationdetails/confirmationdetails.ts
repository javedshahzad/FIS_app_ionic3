import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { IonicSelectableComponent } from 'ionic-selectable';
/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-confirmationdetails',
  templateUrl: 'confirmationdetails.html',
})
export class confirmationdetails {
  CALL_LOG_ID = '';
  createcallForm:FormGroup;
  itemdatavalue:any;
  ASSIGNED_TO_IDworklist:any;
  confirmation:any;
  uservalue:any;
  Assigned:any;
  callconfirmationdetails = this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};
       

            this.createcallForm = this.formBuilder.group({
              Call_No: ['', Validators.compose([Validators.required])],
              CALL_INSPECTION_ID: ['', Validators.compose([Validators.required])],
              Requestor_Name: ['', Validators.compose([Validators.required])],
              INTERM_STATUS: ['', Validators.compose([Validators.required])],
              STATUS_NAME: ['', Validators.compose([Validators.required])],
              Mobile_no: ['', Validators.compose([Validators.required])],
              Unit_Code: ['', Validators.compose([Validators.required])],
              Assigned_to: ['', Validators.compose([Validators.required])],
              Note_For_Supervisor: ['', Validators.compose([Validators.required])],
              comments: ['', Validators.compose([Validators.required])]
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
    this.itemdatavalue = this.callconfirmationdetails[0].confirmationdetails;
    this.ASSIGNED_TO_ID();
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

  ASSIGNED_TO_ID(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/ASSIGNED_to_id/').then((result) => {
      this.Assigned = result;
      this.ASSIGNED_TO_IDworklist = this.Assigned.filter(user => user.TYPE_USER == "Supervisor");
      if(this.ASSIGNED_TO_IDworklist.length > 0){
        this.presentLoadingDefault(false);
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
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
insertCallData(){
  this.presentLoadingDefault(true);
  let commentsForm = this.createcallForm.value;
  commentsForm.Assigned_to= this.uservalue;
  commentsForm.created_by= this.user.UserInfoId;
  commentsForm.modified_by= this.user.UserInfoId;
  this.authService.postData(commentsForm,'Call_inspection/confirmationdetailsinsert/').then((result) => {
    this.closeModal();
    this.confirmation = result;
    this.presentLoadingDefault(false);
    if(this.confirmation.length > 0){
      this.presentLoadingDefault(false);
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
}
userChange(event: {
  component: IonicSelectableComponent,
  value: any 
}) {
  this.uservalue = event.value.RESOURCE_ID;
}
}