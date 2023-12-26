import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
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
  selector: 'page-hotocomment',
  templateUrl: 'hotocomment.html',
})
export class HotoCommentPage {
    hotocommentsdetails:any;
    pushnotificationValues:any;
    hotocommentsForm:FormGroup
    insertedValues: any;
    hotodata =this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};  
            this.hotocommentsForm = this.formBuilder.group({
                COMMENTS: ['', Validators.compose([Validators.required])],
                LEASE_NUMBER: ['', Validators.compose([Validators.required])],
                HOTO_ID:['',Validators.compose([Validators.required])]
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
  inserthotoComments(){
    let hotocommentsData = this.hotocommentsForm.value;
    hotocommentsData.Ctype =0;
    hotocommentsData.USERNAME = this.user.Surname;
    this.presentLoadingDefault(true);
    this.authService.postData(hotocommentsData,'hoto/Hotocommentsinsert').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Comments successfully saved");
      this.insertedValues = result;
      this.closeModal();

      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }


      let push_message = {} as any;
      push_message.title = this.user.Surname
      push_message.message = this.hotocommentsForm.value.COMMENTS;
      push_message.app_platform = app_platform;

      this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
        this.presentLoadingDefault(false);
        this.pushnotificationValues = result;
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
      });

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  ionViewWillLoad() {
    const Data = this.navParams.get('data');
    let myTitle = 'Hoto Comments';
    let HOTO_ID = Data[0].HOTO_ID;
    this.presentLoadingDefault(true);
    this.authService.getData({},'hoto/HotoCommentsList/'+HOTO_ID).then((result) => {
      this.hotocommentsdetails = result;
      this.presentLoadingDefault(false);
      if(this.hotocommentsdetails.length > 0){
        this.presentLoadingDefault(false);
      //this.presentToast(`Data found in ${myTitle}`);
      }else{
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
    
  }
  resetForm(){
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
  if(this.isOpen ==false){
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