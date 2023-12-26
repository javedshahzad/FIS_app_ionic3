import { Component } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-callcomment',
  templateUrl: 'callcomments.html',
})
export class callcomments {
  callcommentsdetails:any
    callcommentsForm:FormGroup
    insertedValues: any;
    calldata:any;
    pushnotificationValues:any;
    CALL_LOG_ID:any;
    userlist:any;
    selected:any;
    call_statusdata = this.navParams.get('data');
    resourse: any = JSON.parse(localStorage.getItem('resourseData'));
    user : any = localStorage.getItem('userData');
    constructor(public platform: Platform ,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};  
            this.callcommentsForm = this.formBuilder.group({
                COMMENTS: ['', Validators.compose([Validators.required])],
                CALL_LOG_ID: ['', Validators.compose([Validators.required])],
                STATUS: ['', Validators.compose([Validators.required])],
                user: [''],
                SMS: [],
                EMAIL: []
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

  ASSIGNED_SITE_MAP(){
    this.authService.getData({},'call_management/Userlist').then((result) => {
      this.userlist = result;
      if(this.userlist.length > 0){
        this.presentLoadingDefault(false);
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  insertCallComments(i:any){
    let CallCommentsData = this.callcommentsForm.value;
    if(CallCommentsData.SMS == true){
      CallCommentsData.SMS = 1;
    }else{
      CallCommentsData.SMS = 0;
    }
    if(CallCommentsData.EMAIL == true){
      CallCommentsData.EMAIL = 1;
    }else{
      CallCommentsData.EMAIL = 0;
    }
    CallCommentsData.created_by = this.user.UserInfoId;
    CallCommentsData.modified_by = this.user.UserInfoId;
    CallCommentsData.Userslist = this.selected ? JSON.stringify(this.selected) :[];
    CallCommentsData.Reference_Id = 0;
    CallCommentsData.ReferenceType = 0;
    CallCommentsData.requster_name = this.call_statusdata[0].REQUESTOR_NAME;
    CallCommentsData.send_by = this.user.Surname;
   // console.log('CallCommentsData => ',CallCommentsData);
    this.presentLoadingDefault(true);
    this.authService.postData(CallCommentsData,'call_management/CallCommentsinsert').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Comments successfully saved");
      this.insertedValues = result;

      var app_platform:string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      let push_message = {} as any;
      push_message.title = this.user.Surname;
      push_message.content = 'CALL COMMENT';
      push_message.message = this.callcommentsForm.value.COMMENTS;
      push_message.app_platform = app_platform;
      // this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
      //   this.presentLoadingDefault(false);
      //   this.pushnotificationValues = result;
      //   this.closeModal();
      // }, (err) => {
      //   this.presentLoadingDefault(false);
      //   this.presentToast("Something went to wrong, please try again later");
      // });
    
     //console.log('List ',this.insertedValues);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  ionViewWillLoad() {
    //console.log(this.user);
    this.calldata = this.navParams.get('data');
    this.CALL_LOG_ID = this.calldata[0].CALL_LOG_ID;
   this.getallcallcomments();
   this.ASSIGNED_SITE_MAP();
    
  }
  getallcallcomments(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'call_management/Callcomments/'+this.CALL_LOG_ID).then((result) => {
      this.callcommentsdetails = result;
      this.presentLoadingDefault(false);
      if(this.callcommentsdetails.length > 0){
        this.presentLoadingDefault(false);
       /* console.log('List ',this.callcommentsdetails);*/
     // this.presentToast(`Data found in ${myTitle}`);
      }else{
        this.presentLoadingDefault(false);
        //this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }
  resetForm(){
    this.callcommentsForm.reset();
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

}