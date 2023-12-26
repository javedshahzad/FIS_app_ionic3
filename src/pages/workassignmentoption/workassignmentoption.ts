import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-workassignmentoption',
  templateUrl: 'workassignmentoption.html',
})
export class workassignmentoption {
  callManagementDetails : any;
  callcommentsForm:FormGroup
  CallinspectionList:any;
  WORK_NOT_STARTED:any;
  WORK_IN_PROGRESS:any;
  PARTIALLY_ASSIGNED:any;
  SearchListall:any;
  not_startlist:any;
  WORK_WAITING_FOR_CLIENT_APPROVAL:any;
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
        //console.log('List ',this.CallinspectionList);
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  getength(){
    let WORK_NOT_STARTED_count =this.CallinspectionList.filter(call => call.STATUS_ID === 251 && call.TYPE_NAME == "Interm Status Count")
    let WORK_IN_PROGRESS_count  =this.CallinspectionList.filter(call => call.STATUS_ID === 252 && call.TYPE_NAME == "Interm Status Count")
    let PARTIALLY_ASSIGNED_count  =this.CallinspectionList.filter(call => call.STATUS_ID === 260 && call.TYPE_NAME == "Interm Status Count")
    let WORK_WAITING_FOR_CLIENT_APPROVAL_count  =this.CallinspectionList.filter(call => call.STATUS_ID === 254 && call.TYPE_NAME == "Interm Status Count")

     if(WORK_NOT_STARTED_count.length >0){
      this.WORK_NOT_STARTED = WORK_NOT_STARTED_count[0].STATUS_COUNT;
    }else{
      this.WORK_NOT_STARTED = 0;
    }
    if(WORK_IN_PROGRESS_count.length >0){
      this.WORK_IN_PROGRESS = WORK_IN_PROGRESS_count[0].STATUS_COUNT;
    }else{
      this.WORK_IN_PROGRESS = 0;
    }
    if(PARTIALLY_ASSIGNED_count.length >0){
      this.PARTIALLY_ASSIGNED = PARTIALLY_ASSIGNED_count[0].STATUS_COUNT;
    }else{
      this.PARTIALLY_ASSIGNED = 0;
    }
    if(WORK_WAITING_FOR_CLIENT_APPROVAL_count.length >0){
      this.WORK_WAITING_FOR_CLIENT_APPROVAL = WORK_WAITING_FOR_CLIENT_APPROVAL_count[0].STATUS_COUNT;
    }else{
      this.WORK_WAITING_FOR_CLIENT_APPROVAL = 0;
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

  WORK_NOT_STARTED_btn(){

    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      INTERM_STATUS_ID : 251,
      TYPE_ID : this.resourse.TYPE_ID
    }
    
    this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
      this.presentLoadingDefault(false);
      let not_startlist = result;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection :not_startlist
    }]

    const myModal: Modal = this.modal.create('callworkassignmentpage', {data :mymodaldata},  myModalOptions);

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

  WORK_IN_PROGRESS_btn(){

    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      INTERM_STATUS_ID : 252,
      TYPE_ID : this.resourse.TYPE_ID
    }
    this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
      this.presentLoadingDefault(false);
      let not_startlist = result;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection :not_startlist
    }]

    const myModal: Modal = this.modal.create('callworkassignmentpage', {data :mymodaldata},  myModalOptions);

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

  PARTIALLY_ASSIGNED_btn(){

    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      INTERM_STATUS_ID : 260,
      TYPE_ID : this.resourse.TYPE_ID
    }
    this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
      this.presentLoadingDefault(false);
      let not_startlist = result;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection :not_startlist
    }]

    const myModal: Modal = this.modal.create('callworkassignmentpage', {data :mymodaldata},  myModalOptions);

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

  WORK_WAITING_FOR_CLIENT_APPROVAL_btn(){

    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      INTERM_STATUS_ID : 254,
      TYPE_ID : this.resourse.TYPE_ID
    }
    this.authService.postData(data,'Call_inspection/getAllCallList/').then((result) => {
      this.presentLoadingDefault(false);
      let not_startlist = result;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection :not_startlist
    }]

    const myModal: Modal = this.modal.create('callworkassignmentpage', {data :mymodaldata},  myModalOptions);

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
      if(this.SearchListall[0].STATUS_ID == 238){
        if(this.SearchListall[0].INTERM_STATUS_ID == 251){
          let data ={
            Resoursename : this.resourse.EMPNAME,
            INTERM_STATUS_ID : 251,
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
        
            const myModal: Modal = this.modal.create('callworkassignmentpage', {data :mymodaldata},  myModalOptions);
        
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
        }else if(this.SearchListall[0].INTERM_STATUS_ID == 252){
          let data ={
            Resoursename : this.resourse.EMPNAME,
            INTERM_STATUS_ID : 252,
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
        
            const myModal: Modal = this.modal.create('callworkassignmentpage', {data :mymodaldata},  myModalOptions);
        
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
        }else if(this.SearchListall[0].INTERM_STATUS_ID == 254){
          let data ={
            Resoursename : this.resourse.EMPNAME,
            INTERM_STATUS_ID : 254,
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
        
            const myModal: Modal = this.modal.create('callworkassignmentpage', {data :mymodaldata},  myModalOptions);
        
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
        }else if(this.SearchListall[0].INTERM_STATUS_ID == 260){
          let data ={
            Resoursename : this.resourse.EMPNAME,
            INTERM_STATUS_ID : 260,
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
        
            const myModal: Modal = this.modal.create('callworkassignmentpage', {data :mymodaldata},  myModalOptions);
        
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
