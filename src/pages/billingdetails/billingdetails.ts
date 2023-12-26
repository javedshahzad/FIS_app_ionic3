import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,ViewController} from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import Swal from 'sweetalert2'
import { CallmanagementPage } from '../callmanagement/callmanagement';
/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-billingdetails',
  templateUrl: 'billingdetails.html',
})
export class callbillingdetails {
  CALL_LOG_ID = '';
  calinspectioncommentsForm:FormGroup;
  callinventoryininsert:FormGroup;
  workasslist:any;
  commentlist:any;
  ITEM_IDdata:any;
  comment ='none';
  WorkOrder1 ='none';
  comment1 ='none';
  TASKASSIGNMENT_IDdata:any
  insertedValuesinventory:any;
  ASSIGNED_TO_IDdata:any;
  STATUSdata:any;
  itemdatavalue=[] as any;
  REFERENCE1 =[] as any;
  date:any;
  selected:any;
  AllCustomerslist:any;
  CallLogAllCallslist:any;
  AllLocationlist:any;
  AllPaymentTermlist:any;
  AllTransactionTypelist:any;
  buildingby_loclist:any;
  UNIT_GET_ALLlist:any;
  REFERENCEdata:any;
  insertedValues:any;
  callcomplientsdetails:any;
  call_create_details:any;
  callbillingdetails = this.navParams.get('data');
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
              Call_No: ['', Validators.compose([Validators.required])],
              Requestor_Name: ['', Validators.compose([Validators.required])],
              Mobile_no: ['', Validators.compose([Validators.required])],
              Date: ['', Validators.compose([Validators.required])],
              GL_Date: ['', Validators.compose([Validators.required])],
              Payment_Term: ['', Validators.compose([Validators.required])],
              Transaction_Type: ['', Validators.compose([Validators.required])],
              Due_Date: ['', Validators.compose([Validators.required])],
              Customer_Oracle: ['', Validators.compose([Validators.required])],
              Amount: ['', Validators.compose([Validators.required])],
              Description: ['', Validators.compose([Validators.required])],
              Location: ['', Validators.compose([Validators.required])],
              Building: ['', Validators.compose([Validators.required])],
              Unit: ['', Validators.compose([Validators.required])],
              Customer: ['', Validators.compose([Validators.required])],
              Reference: ['', Validators.compose([Validators.required])],
              INTERFACE_LINE_1: ['', Validators.compose([Validators.required])],
              INTERFACE_LINE_2: ['', Validators.compose([Validators.required])],
              INTERFACE_LINE_3: ['', Validators.compose([Validators.required])],
              INTERFACE_LINE_4: ['', Validators.compose([Validators.required])],
              Customer_Site: ['', Validators.compose([Validators.required])]
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
    this.date = new Date();
    this.call_create_details = this.callbillingdetails[0].Inspection[0];
    this.getcallCompliantdetails(this.callbillingdetails[0].Inspection[0].CALL_LOG_ID);
    /*console.log('billing',this.callbillingdetails);*/
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
addeditget(item:any){
  this.itemdatavalue = item;
  this.GetAllCustomers();
  this.GetCallLogAllCalls();
  this.GetAllLocation();
  this.GetAllPaymentTerm();
  this.GetAllTransactionType();
  this.Getbuildingby_loc(this.itemdatavalue.LOCATION_ID);
  this.GetUNIT_GET_ALL(this.itemdatavalue.BUILDING_ID);
  /*console.log(this.itemdatavalue);*/
this.WorkOrder1 ='block';
}
GetAllCustomers(){
  this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/GetAllCustomersList/').then((result) => {
      this.presentLoadingDefault(false);
      this.AllCustomerslist = result;
      this.AllCustomerslist = result;
      if(this.AllCustomerslist.length > 0){
        /*console.log('AllCustomers ',this.AllCustomerslist);*/
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
}
GetCallLogAllCalls(){
    this.authService.getData({},'Call_inspection/Callclosedcall/').then((result) => {
      this.presentLoadingDefault(false);
      this.CallLogAllCallslist = result;
      this.CallLogAllCallslist = result;
      if(this.CallLogAllCallslist.length > 0){
       /* console.log('AllCalls ',this.CallLogAllCallslist);*/
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
}
GetAllLocation(){
  this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/GetAllLocationList/').then((result) => {
      this.AllLocationlist = result;
      this.AllLocationlist = result;
      if(this.AllLocationlist.length > 0){
        /*console.log('AllLocation ',this.AllLocationlist);*/
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
}
GetAllPaymentTerm(){
  this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/GetAllPaymentTermList/').then((result) => {
      this.AllPaymentTermlist = result;
      this.AllPaymentTermlist = result;
      if(this.AllPaymentTermlist.length > 0){
        /*console.log('AllPaymentTerm ',this.AllPaymentTermlist);*/
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
}
GetAllTransactionType(){
  this.presentLoadingDefault(true);
  this.authService.getData({},'Call_inspection/GetAllTransactionTypeList/').then((result) => {
    this.AllTransactionTypelist = result;
    this.AllTransactionTypelist = result;
    if(this.AllTransactionTypelist.length > 0){
     /* console.log('AllTransactionType ',this.AllTransactionTypelist);*/
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
}
Getbuildingby_loc(LOCATION_ID:any){
  this.presentLoadingDefault(true);
  this.authService.getData({},'Call_inspection/Getbuildingby_locList/'+LOCATION_ID+'').then((result) => {
    this.buildingby_loclist = result;
    this.presentLoadingDefault(false);
    if(this.buildingby_loclist.length > 0){
      /*console.log('buildingby_loc ',this.buildingby_loclist);*/
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
}

GetUNIT_GET_ALL(BUILDING_ID:any){
  this.presentLoadingDefault(true);
  this.authService.getData({},'Call_inspection/GetUNIT_GET_ALL_List/'+BUILDING_ID+'').then((result) => {
    this.UNIT_GET_ALLlist = result;
    this.presentLoadingDefault(false);
    if(this.UNIT_GET_ALLlist.length > 0){
      /*console.log('UNIT_GET_ALL ',this.UNIT_GET_ALLlist);*/
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
}
Get_reference(REFERENCE:any){
this.REFERENCE1 = this.UNIT_GET_ALLlist.filter(call => call.UNIT_ID === parseInt(REFERENCE));
this.REFERENCEdata = this.REFERENCE1[0].UNIT;
}

insertinventory(){    
  let Billinginsertata = this.callinventoryininsert.value;
  Billinginsertata.created_by= this.user.UserInfoId;
  Billinginsertata.modified_by= this.user.UserInfoId;
  this.presentLoadingDefault(true);
  this.authService.postData(Billinginsertata,'Call_inspection/Billinginsertdatainsert').then((result) => {
    this.presentLoadingDefault(false);
    this.presentToast("Bill successfully created");
    this.insertedValues = result;
  /* console.log('List ',this.insertedValues);*/
   this.WorkOrder1 ='none';
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
  });
}
export(AMOUNT:any,GL_DATE:any,TERM:any,PAYMENT_TERM_NAME:any){

  
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
        'Inserted',
        'Your data is Confirmated.',
        'success'
      )
      
      let Billinginsertata = this.callinventoryininsert.value;
      Billinginsertata.AMOUNT= AMOUNT;
      Billinginsertata.GL_DATE= GL_DATE;
      Billinginsertata.TERM= TERM;
      Billinginsertata.PAYMENT_TERM_NAME= PAYMENT_TERM_NAME;
      Billinginsertata.created_by= this.user.UserInfoId;
      Billinginsertata.modified_by= this.user.UserInfoId;
      /*console.log(Billinginsertata);*/
      this.presentLoadingDefault(true);
  this.authService.postData(Billinginsertata,'Call_inspection/Ra_Interfaces_Line_insert').then((result) => {
    this.presentLoadingDefault(false);
    this.navCtrl.setRoot(CallmanagementPage);
    this.insertedValues = result;
   /*console.log('List ',this.insertedValues);*/
   this.WorkOrder1 ='none';
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
}