import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';

@IonicPage()
@Component({
  selector: 'page-taskgrouplabels',
  templateUrl: 'taskgrouplabels.html',
})
export class TaskGroupLabelPage {
  userdetails: any;
  taskdetails = {
    taskgrouplistcount:[] as any
  } as any;
  taskdetailsall: any;
  taskdetailsearchall = {} as any;
  myModalData: any;
  tasknotication: any;
  insertedValues: any;
  task_List = 'block';
  task_show = 'none';
  searchData = { "search_value": "" };
  TYPE: any;
  USER_ID:any;
  USER_NAME: any;
  today: any;
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  loading = this.loadingCtrl.create();
  presentLoadingDefault(show) {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create();
    }
    if (show) {
      this.loading.present();
    }
    else {
      this.loading.dismissAll();
      this.loading = null
    }
  };

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  createtask() {
    this.navCtrl.push(CreateTaskPage, {}, { animate: false });
  }


  ionViewDidLoad() {
    console.log(this.modaltype[0]);
    this.gettask();
  }
  
  gettask() {    
    this.presentLoadingDefault(true);
    let params = {} as any;
    params.UserInfoId = this.user.UserInfoId;
    params.label_type = this.modaltype[0];

    this.authService.postData(params, 'task/TaskGroupList').then((result) => {
      this.taskdetails = result;
      this.taskdetailsearchall = result;
      console.log('task group -->',this.taskdetails); 
      this.presentLoadingDefault(false);    

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }
 
  openTaskModal(type: any,created_by:any) {


    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    if (type == "Active") {

      this.myModalData = [created_by,
      this.TYPE = type
      ]
        

    } else if (type == "Overdue") {

      this.myModalData = [created_by,
      this.TYPE = type
      ]

    } else if (type == "Referal") {

      this.myModalData = [created_by,
      this.TYPE = type
      ]
 

    }else if (type == "Completed") {

      this.myModalData = [created_by,
      this.TYPE = type
      ]
   

    }else if (type == "Personal") {

      this.myModalData = [created_by,
      this.TYPE = type
      ]
   

    } else {

      this.myModalData = [created_by,
      this.TYPE = type
      ]

    }

    let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: this.myModalData }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {
      this.gettask();
    });
    myModal.onWillDismiss((data) => {
    });

  }

  closeModal() {
    this.view.dismiss();
  }


  
  getImage(row_no, item: any) {

    let objFile = this.taskdetails.taskgrouplistcount.find(o => o.PROFILE_IMG_ID === row_no);
    if(objFile.FILE_CONTENT){
      let bytes = objFile.FILE_CONTENT.data ? objFile.FILE_CONTENT.data : null;
      if(!bytes)
        return `./assets/imgs/no-found-photo.png`;
      let file_name = objFile.FILE_NAME;
      let nameSplit = file_name.split('.');
      let extn = nameSplit[nameSplit.length - 1];
      if (extn == "jpg" || extn == "jpeg" || extn == "png") {
        if (objFile.MYPROFILECOUNT > 0) {
          return `data:image/${extn};base64,${this.encode(bytes)}`;
        } else {
          return `./assets/imgs/no-found-photo.png`
        }
      }else
        return `./assets/imgs/no-found-photo.png`
      
    }else{
      if (objFile.FILE_PATH) 
        return objFile.FILE_PATH;
       else 
        return `./assets/imgs/no-found-photo.png`
    }
  }

  encode(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
      chr1 = input[i++];
      chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
      chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
        keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
  }
  
 
}
