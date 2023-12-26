import { Component } from '@angular/core';
import {IonicPage,Platform,NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
/**
 * Generated class for the ReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-receiptcreate',
  templateUrl: 'receiptcreate.html',
})
export class ReceiptcreatePage {
receiptForm:FormGroup
user : any = localStorage.getItem('userData');
  buildingList: any;
  insertedValues: any;
  BUILDING:any;
  cheque_date ='block';
  cheque_no = 'block';
  cash_cheque ='block';
  email_validation :any;
  email:any;
  code = '00971';
  moblie_no_error:any;
  mobile:any;
  pushnotificationValues:any;
  today:string=new Date().toISOString();
  minDate:string=new Date().toISOString();
  constructor(public platform: Platform ,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public authService:RestProvider, public toastCtrl:ToastController,
              public loadingCtrl: LoadingController, public view: ViewController) { 
      this.user = this.user ? JSON.parse(this.user) : {};  
        this.receiptForm = this.formBuilder.group({
          isSecChq:[],
          code:[],
          cash_chq: [],
          buidling: ['', Validators.compose([Validators.required])],
          amount: ['', Validators.compose([Validators.required])],
          receivedfrom: ['', Validators.compose([Validators.required])],
          remarks: ['', Validators.compose([Validators.required])],
          chqno: [],
          chequedate: [],
          unitno: ['', Validators.compose([Validators.required])],
          mobile_number: ['', Validators.compose([Validators.required,Validators.minLength(9), Validators.maxLength(9)])],
          email: ['',Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])]
        });
  }
  ionViewDidLoad() {
    //console.log(this.today);
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'receipts/getBuildingListDetails').then((result) => {
      this.presentLoadingDefault(false);
      this.buildingList = result;
      if (this.buildingList.length > 0) {
       // console.log('List ', this.buildingList);        
      } else {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }
  email_Change(event){
    let email_value = event.target.value;
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    let serchfind = regexp.test(email_value);
   if(serchfind == false){
    this.email_validation = 'Enter the email';
    this.email = null;
   }else{
    this.email_validation = '';
   }
  }

  moblie_no_Change(event){
    let moblie_no_length = event.target.value
      if(moblie_no_length.length > 9){
        this.moblie_no_error = "Please Enter the correct number";
        this.mobile = null;
      }else if(moblie_no_length.length < 9){
        this.moblie_no_error = "Please Enter the correct number";
        this.mobile = null;
      }else{
        this.moblie_no_error = "";
      }
    }

 inValidCashChq:boolean = false;
  validReceiptData(){
    let receiptData = this.receiptForm.value;
    if(receiptData.isSecChq){
     receiptData.cash_chq = 0;
       this.insertReceiptData(receiptData)
    }else{
      if(receiptData.cash_chq){
        if(receiptData.cash_chq == 2){
          let _cno=receiptData.chqno ? receiptData.chqno.trim():null;
          if(_cno){
                  this.insertReceiptData(receiptData)  
          }else{
            this.presentToast("Please enter Cheque no");
          }
        }else{
                this.insertReceiptData(receiptData)  
        }      
      }else{
        this.inValidCashChq =true
        this.presentToast("Please select Cheque or Cash");
      }
    }
  }
  insertReceiptData(receiptData){    
    receiptData.code = receiptData.code ? receiptData.code :'00971';
    receiptData.status= "1"; 
    receiptData.created_on= "";
    receiptData.buidling = this.BUILDING;
    receiptData.modified_by = this.user.UserInfoId;
    receiptData.created_by = this.user.UserInfoId;
    receiptData.user_name = this.user.Surname
    var isSecChq_check = 0;
    if(receiptData.isSecChq == true){
      isSecChq_check = 1;
    }
    receiptData.isSecChq = isSecChq_check
    this.presentLoadingDefault(true);
    this.authService.postData(receiptData,'receipts/getInsertReceiptDetails').then((result:any) => {
      this.presentLoadingDefault(false);
      this.presentToast("Receipt successfully saved and Receipt no." + result.p_id);
      var app_platform:string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      let push_message = {} as any;
      push_message.title = this.user.Surname
      push_message.message = 'COMMENTS'+receiptData.remarks;
      push_message.content = 'RECEIPT INSERTED AND RECEIPT NUMBER '+ result;
      push_message.app_platform = app_platform;

      // this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
      //   this.presentLoadingDefault(false);
      //   this.pushnotificationValues = result;
      //   this.closeModal();
      // }, (err) => {
      //   this.presentLoadingDefault(false);
      //   this.presentToast("Something went to wrong, please try again later");
      // });
      this.insertedValues = result;
     this.resetForm();
     this.closeModal();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }
  resetForm(){
    this.receiptForm.reset();
    this.code='00971';
    this.receiptForm.controls['code'].setValue('00971');
    this.today=new Date().toISOString();
    //this.navCtrl.push(SearchPage, {}, {animate: false});
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
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

  closeModal() {
    this.view.dismiss();
  }

  buldingChange(event: {
    component: IonicSelectableComponent,
    value: any 
  }) {
    this.BUILDING = event.value.BUILDING_ID
  }
  case(event:any){
    if(event.currentTarget.value == 1){
     this.cheque_no ='none';
     this.cheque_date ='none';

    }else{
     this.cheque_no ='block';
     this.cheque_date ='block';
    }
  }
  Cheque(event:any){
    if(event.currentTarget.value == 2){
      this.cheque_no ='block';
      this.cheque_date ='block';
     }else{
      this.cheque_no ='none';
      this.cheque_date ='none';
     }
  }
  Security(event){
    if(event.target.checked == true){
      this.cheque_date ='none';
      this.cash_cheque ='none';
    }else{
      this.cheque_no ='block';
      this.cash_cheque ='block';
    }
  }
}
