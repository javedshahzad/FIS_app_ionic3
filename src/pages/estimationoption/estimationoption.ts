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
  selector: 'page-estimationoption',
  templateUrl: 'estimationoption.html',
})
export class estimationoption {
  callManagementDetails : any;
  callcommentsForm:FormGroup
  CallinspectionList:any;
  ESTIMATION_NOT_STARTED:any;
  MANAGER_APPROVAL:any;
  CLIENT_APPROVAL:any;
  NOT_MANAGER_APPROVAL:any;
  Callinspectionoption:any;
  SearchListall:any;
  not_startlist:any;
  searchData = {"search_value": ""};
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
    this.Callinspectiondata();
  }

  Callinspectiondata(){
    this.presentLoadingDefault(true);

   let data ={
      Resoursename : this.resourse.EMPNAME,
      TYPE_ID : this.resourse.TYPE_ID
    }
    this.authService.postData(data,'Call_inspection/CallinspectionList/').then((result) => {
      this.presentLoadingDefault(false);
      this.CallinspectionList = result;
      this.callManagementDetails = result;
      if(this.CallinspectionList.length > 0){
        this.getength();
       // this.Closedcalldata();
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }
  getength(){
    let ESTIMATION_NOT_STARTED_count =this.CallinspectionList.filter(call => call.STATUS_ID === 246 && call.TYPE_NAME == "Interm Status Count")
    let NOT_MANAGER_APPROVAL_count =this.CallinspectionList.filter(call => call.STATUS_ID === 247 && call.TYPE_NAME == "Interm Status Count")
    let CLIENT_APPROVAL_count =this.CallinspectionList.filter(call => call.STATUS_ID === 249 && call.TYPE_NAME == "Interm Status Count")
    let MANAGER_APPROVAL_count =this.CallinspectionList.filter(call => call.STATUS_ID === 248 && call.TYPE_NAME == "Interm Status Count")

     if(ESTIMATION_NOT_STARTED_count.length >0){
      this.ESTIMATION_NOT_STARTED = ESTIMATION_NOT_STARTED_count[0].STATUS_COUNT;
    }else{
      this.ESTIMATION_NOT_STARTED = 0;
    }
    if(NOT_MANAGER_APPROVAL_count.length >0){
      this.NOT_MANAGER_APPROVAL = NOT_MANAGER_APPROVAL_count[0].STATUS_COUNT;
    }else{
      this.NOT_MANAGER_APPROVAL = 0;
    }
    if(CLIENT_APPROVAL_count.length >0){
      this.CLIENT_APPROVAL = CLIENT_APPROVAL_count[0].STATUS_COUNT;
    }else{
      this.CLIENT_APPROVAL = 0;
    }
    if(MANAGER_APPROVAL_count.length >0){
      this.MANAGER_APPROVAL = MANAGER_APPROVAL_count[0].STATUS_COUNT;
    }else{
      this.MANAGER_APPROVAL = 0;
    }
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

  ESTIMATION_NOT_STARTEDbtn(){

    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      INTERM_STATUS_ID : 246,
      TYPE_ID : this.resourse.TYPE_ID,
      
    }
    this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
      this.presentLoadingDefault(false);
      let not_startlist = result;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection : not_startlist,
      type : 'Not Open'
    }]

    const myModal: Modal = this.modal.create('callestimationpage', {data :mymodaldata},  myModalOptions);

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

  PENDING_FOR_CLIENT_APPROVAL(){
    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      INTERM_STATUS_ID : 249,
      TYPE_ID : this.resourse.TYPE_ID,
    }
    this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
      this.presentLoadingDefault(false);
      let not_startlist = result;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection : not_startlist,
      type : 'Not Open'
    }]

    const myModal: Modal = this.modal.create('callestimationpage', {data :mymodaldata},  myModalOptions);

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

  PENDING_FOR_MANAGER_APPROVAL(){

    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      INTERM_STATUS_ID : 248,
      TYPE_ID : this.resourse.TYPE_ID
    }
    this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
      this.presentLoadingDefault(false);
      let not_startlist = result;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection : not_startlist,
      type : 'Open'
    }]

    const myModal: Modal = this.modal.create('callestimationpage', {data :mymodaldata},  myModalOptions);

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

  NOT_FOR_MANAGER_APPROVAL(){

    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      INTERM_STATUS_ID : 247,
      TYPE_ID : this.resourse.TYPE_ID
    }
    this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
      this.presentLoadingDefault(false);
      let not_startlist = result;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection : not_startlist,
      type : 'Not Open'
    }]

    const myModal: Modal = this.modal.create('callestimationpage', {data :mymodaldata},  myModalOptions);

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

  SearchcallManagement(){
    if(this.searchData.search_value){
      this.presentLoadingDefault(true);
      this.authService.postData(this.searchData,'Call_inspection/getCallSearchList').then((result) => {
      this.SearchListall = result;
      //console.log(this.SearchListall);
      if(this.SearchListall[0].STATUS_ID == 237){
        if(this.SearchListall[0].INTERM_STATUS_ID == 246){
          let data ={
            Resoursename : this.resourse.EMPNAME,
            INTERM_STATUS_ID : 246,
            TYPE_ID : this.resourse.TYPE_ID,
            
          }
          this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
            this.presentLoadingDefault(false);
            this.not_startlist = result;
            var item = parseInt(this.searchData.search_value);
            var finallist =[];
            if(isNaN(item)){            
              finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
            }else{
              finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
            }
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata = [{
              inspection: finallist[0]
            }]
        
            const myModal: Modal = this.modal.create('callestimationpage', {data :mymodaldata},  myModalOptions);
        
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
        }else if(this.SearchListall[0].INTERM_STATUS_ID == 247){
          let data ={
            Resoursename : this.resourse.EMPNAME,
            INTERM_STATUS_ID : 247,
            TYPE_ID : this.resourse.TYPE_ID
          }
          this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
            this.presentLoadingDefault(false);
            this.not_startlist = result;
            var item = parseInt(this.searchData.search_value);
            var finallist =[];
            if(isNaN(item)){            
              finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
            }else{
              finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
            }
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata = [{
              inspection: finallist[0]
            }]
        
            const myModal: Modal = this.modal.create('callestimationpage', {data :mymodaldata},  myModalOptions);
        
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
        }else if(this.SearchListall[0].INTERM_STATUS_ID == 248){
          let data ={
            Resoursename : this.resourse.EMPNAME,
            INTERM_STATUS_ID : 248,
            TYPE_ID : this.resourse.TYPE_ID
          }
          this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
            this.presentLoadingDefault(false);
            this.not_startlist = result;
            var item = parseInt(this.searchData.search_value);
            var finallist =[];
            if(isNaN(item)){            
              finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
            }else{
              finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
            }
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata = [{
              inspection: finallist[0]
            }]
        
            const myModal: Modal = this.modal.create('callestimationpage', {data :mymodaldata},  myModalOptions);
        
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
        }else if(this.SearchListall[0].INTERM_STATUS_ID == 249){
          let data ={
            Resoursename : this.resourse.EMPNAME,
            INTERM_STATUS_ID : 249,
            TYPE_ID : this.resourse.TYPE_ID,
          }
          this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
            this.presentLoadingDefault(false);
            this.not_startlist = result;
            var item = parseInt(this.searchData.search_value);
            var finallist =[];
            if(isNaN(item)){            
              finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
            }else{
              finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
            }
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata = [{
              inspection: finallist[0]
            }]
        
            const myModal: Modal = this.modal.create('callestimationpage', {data :mymodaldata},  myModalOptions);
        
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
