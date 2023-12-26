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
  selector: 'page-lpo-model',
  templateUrl: 'lpo-model.html',
})
export class Lpomodelcomments {
  lpocommentsdetails:any
  lpocommentsForm:FormGroup
    insertedValues: any;
    calldata:any;
    pushnotificationValues:any;
    lpodata = this.navParams.get('data');
    user : any = localStorage.getItem('userData');
  userlist:any;
  IS_SMS:any =false;
  IS_EMAIL:any = false;
  selectLabel:any ='User';
  IS_CHECK :any =false;
    constructor(public platform: Platform ,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};  
            this.lpocommentsForm = this.formBuilder.group({
                COMMENTS: ['', Validators.compose([Validators.required])],
                LPO_ID: ['', Validators.compose([Validators.required])],
          USER:[''],
          IS_SMS:[''],
          IS_EMAIL:['']
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
  insertlpoComments(i:any){
    let LpoCommentsData :any = this.lpocommentsForm.value;
    //console.log(this.user);
    LpoCommentsData.created_by = this.user.UserInfoId;
    LpoCommentsData.modified_by = this.user.UserInfoId;
    LpoCommentsData.ReferenceType = 'LPO COMMENT';
    //console.log(LpoCommentsData);
    let _valid =true;
    if(_valid){      
      LpoCommentsData.USER = JSON.stringify(LpoCommentsData.USER);
      this.presentLoadingDefault(true);
      this.authService.postData(LpoCommentsData,'Lpo/LpoCommentsinsert').then((result) => {
        this.presentToast("Comments successfully saved");
        this.insertedValues = result;

        // var app_platform:string = '';
        // if (this.platform.is('ios')) {
        //   app_platform = 'ios';
        // }

        // if (this.platform.is('android')) {
        //   app_platform = 'android';
        // }

        // let push_message = {} as any;
        // push_message.title = this.user.Surname
        // push_message.content = 'LPO COMMENT';
        // push_message.message = this.lpocommentsForm.value.COMMENTS;
        // push_message.app_platform = app_platform;

        // this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
           this.presentLoadingDefault(false);
        //   this.pushnotificationValues = result;
        //   this.resetForm();
        //   this.getlpodetails();
        // }, (err) => {
        //   this.presentLoadingDefault(false);
        //   this.presentToast(err);
        // });
        // console.log('List ',this.insertedValues);
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }

  ionViewWillLoad() {
    this.calldata = this.navParams.get('data');
    this.getlpodetails();
   // this.GetUserList();
  }

  getlpodetails(){
    let myTitle = 'LPO';
    var LPO_ID =0;
    if(this.calldata[0].LABEL_ID != null){
      LPO_ID =  this.calldata[0].LABEL_ID;
    }else if(this.calldata[0].LPO_ID != null){
      LPO_ID =  this.calldata[0].LPO_ID;
    }
    
    this.presentLoadingDefault(true);
    this.authService.getData({},'Lpo/getlpoCommentsDAL/'+LPO_ID).then((result:any) => {

      this.lpocommentsdetails = result.filter(lpo =>lpo.COMMENTS != null && lpo.USER_SURNAME !=null);
      this.presentLoadingDefault(false);
      if(this.lpocommentsdetails.length > 0){
        this.presentLoadingDefault(false);
        //console.log('List ',this.lpocommentsdetails);
      //this.presentToast(`Data found in ${myTitle}`);
      }else{
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast(err);
    });
    
  }

  GetUserList(){
    this.authService.postData({is_active:1},'account/GetSearchList').then((result) => {
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

  changeToSend(type){
    this.IS_CHECK =true;
    if(type =='SMS'){  
      this.IS_EMAIL =  false;     
      this.selectLabel ='SMS to';
    }else{
      this.IS_SMS =  false;
      this.selectLabel ='Email to';
    }  
    if(!this.IS_EMAIL && !this.IS_SMS){      
      this.IS_CHECK =false;
    }
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
    this.lpocommentsForm.reset();
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

}