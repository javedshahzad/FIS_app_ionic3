import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';


/**
 * Generated class for the Call Management page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-workcompletedoption',
  templateUrl: 'workcompletedoption.html',
})
export class workcompletedoption {
  callManagementDetails : any;
  callcommentsForm:FormGroup
  CallinspectionList:any;
  BILLING:any;
  WORK_IN_PROGRESS:any;
  CLOSED:any;
  CallList:any;
  not_startlist:any;
  SearchListall:any;
  searchData = {"search_value": ""};
  Callinspectionoption = this.navParams.get('data');
  user : any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService:RestProvider, public toastCtrl:ToastController,private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
        this.user = this.user ? JSON.parse(this.user) : {};  
        this.callcommentsForm = this.formBuilder.group({
            Comments: ['', Validators.compose([Validators.required])]
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
    console.log('ionViewDidLoad');
  //  this.Callinspectiondata();
    this.Callclosedlist();
  }

  // Callinspectiondata(){
  //   this.presentLoadingDefault(true);
  //   this.authService.getData({},'Call_inspection/CallinspectionList/').then((result) => {
  //     this.presentLoadingDefault(false);
  //     this.CallinspectionList = result;
  //     this.callManagementDetails = result;
  //     if(this.CallinspectionList.length > 0){
  //       this.getength();
  //      // this.Closedcalldata();
  //       console.log('List ',this.CallinspectionList);
  //     }else{
  //       this.presentLoadingDefault(false);
  //     }
  //   }, (err) => {
  //     this.presentLoadingDefault(false);
  //   this.presentToast("Something went to wrong, please try again later");
  //   });
  // }

  Callclosedlist(){
    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      INTERM_STATUS_ID : 256,
      TYPE_ID : this.resourse.TYPE_ID,
      
    }
    this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
      this.CallList = result;
      this.presentLoadingDefault(false);
      if(this.CallList.length > 0){
        this.getength1();
       // this.Closedcalldata();
        //console.log('List ',this.CallList);
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  getength1(){
    this.BILLING  =this.CallList.filter(call => call.INTERM_STATUS_ID === 256 && call.IS_BILLED !=1);
   
    this.CLOSED =this.CallList.filter(call => call.IS_BILLED === 1);
  }

 
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }

  goBack(){
    this.view.dismiss();
  }

  
  resetForm(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  BILLING_btn(){

    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      INTERM_STATUS_ID : 256,
      TYPE_ID : this.resourse.TYPE_ID
    }
    this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
      this.presentLoadingDefault(false);
      this.not_startlist = result;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection : this.not_startlist.filter(call => call.IS_BILLED !=1),
      title:'BILLING'
    }]

    const myModal: Modal = this.modal.create('billingpage', {data :mymodaldata},  myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
  });

  }

  CLOSED_btn(){

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection :this.CallList.filter(call => call.IS_BILLED === 1),
      title:'CLOSED'
    }]

    const myModal: Modal = this.modal.create('closedpage', {data :mymodaldata},  myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }

  SearchcallManagement(){
    if(this.searchData.search_value){
      this.presentLoadingDefault(true);
      this.authService.postData(this.searchData,'Call_inspection/getCallSearchList').then((result) => {
      this.SearchListall = result;
     // console.log(this.SearchListall);
      if(this.SearchListall[0].INTERM_STATUS_ID == 256){
        if(this.SearchListall[0].INTERM_STATUS_ID == 256 && this.SearchListall[0].IS_BILLED !=1){
          let data ={
            Resoursename : this.resourse.EMPNAME,
            INTERM_STATUS_ID : 256,
            TYPE_ID : this.resourse.TYPE_ID
          }
          this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
            this.presentLoadingDefault(false);
            this.not_startlist = result;
            var item = parseInt(this.searchData.search_value);
            var finallist =[];
            if(isNaN(item)){            
              finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value && call.IS_BILLED !=1));
            }else{
              finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item && call.IS_BILLED !=1));
            }

          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };

          let mymodaldata =[{
            inspection : finallist[0],
          }]

          const myModal: Modal = this.modal.create('billingpage', {data :mymodaldata},  myModalOptions);

          myModal.present();

          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });

          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });

        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast("Something went to wrong, please try again later");
        });
        }else if(this.SearchListall[0].IS_BILLED == 1){

          let INTERM_STATUS_ID = 256;
          this.authService.getData({},'Call_inspection/getAllCallList/'+INTERM_STATUS_ID+'').then((result) => {
            this.presentLoadingDefault(false);
            this.not_startlist = result;
            var item = parseInt(this.searchData.search_value);
            var finallist =[];
            if(isNaN(item)){            
              finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value && call.IS_BILLED ==1));
            }else{
              finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item && call.IS_BILLED ==1));
            }

          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };

          let mymodaldata =[{
            inspection : finallist[0],
          }]

          const myModal: Modal = this.modal.create('closedpage', {data :mymodaldata},  myModalOptions);

          myModal.present();

          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });

          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });

        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast("Something went to wrong, please try again later");
        });
        }
      }else{
        this.presentLoadingDefault(false);
        this.presentToast("No found data");
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
    }else if(this.searchData.search_value ==''){
      this.presentLoadingDefault(false);
    }else{
      this.presentLoadingDefault(false);
      this.SearchListall;
    } 
  }
}
