import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, ActionSheetController, NavParams, ToastController, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Constant } from '../../providers/constant/constant'
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { AngularCropperjsComponent } from 'angular-cropperjs';

@IonicPage()
@Component({
  selector: 'page-myprofile',
  templateUrl: 'myprofile.html',
})
export class MyprofilePage {
  
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  resourcedetails: any = localStorage.getItem('resourseData');
  user: any = localStorage.getItem('userData');
  Data = this.navParams.get('data');
  cropperOptions: any;
  croppedImage = null;
  updatePasswordForm: FormGroup;
  myImage = null;
  scaleValX = 1;
  scaleValY = 1;
  show_profile_image = 0;
  show_profile_image_crop = 1;
  userdata: any = JSON.parse(this.user);
  file_name: any;
  size: any;
  imageURI: any;
  myprofile: any;
  myprofilecount: any;
  downloadUrl: any;
  isPassUpdate: boolean = false;
  CONF_PASS:any;
  PASS:any;
  IsAdUser:any=0;
  public profileImg: string;
  public base64Image: string; 
  public photos: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, 
    private formBuilder: FormBuilder, public loadingCtrl: LoadingController, public authService: RestProvider, 
    public platform: Platform, private camera: Camera, private file: File, private fileOpener: FileOpener, 
    public constant: Constant, private actionsheetCtrl: ActionSheetController,private alertCtrl: AlertController,
    public view: ViewController
  ) {
    this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 1,
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.8,
    };
    this.updatePasswordForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required])],
      confirmPassword:['', Validators.compose([Validators.required])],
    }, {validator: this.checkPasswords });

    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};
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

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { 'notSame': true }     
  }

  showPassUpdate(){
    this.isPassUpdate = this.isPassUpdate ? false :true;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MyprofilePage');
    this.myprofilecount = 0;
    this.getmyprofiledetails();
    this.profileImg = 'http://flexion.fakhruddinproperties.com:8883/profile/' + this.userdata.UserInfoId + '/myimage.jpeg';
    this.IsAdUser = this.userdata.IsAdUser;

  }

  rotate() {
    this.angularCropper.cropper.rotate(90);
  }

  closeModal() {
    this.view.dismiss();
  }

  reset() {
    this.angularCropper.cropper.reset();
  }

  zoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }

  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }

  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }

  move(x, y) {
    this.angularCropper.cropper.move(x, y);
  }
  
  save() {
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.croppedImage = croppedImgB64String;
    this.imageURI = croppedImgB64String;
    this.photos.push(croppedImgB64String);
    this.show_profile_image = 0;
    this.show_profile_image_crop = 1;
    this.photos.reverse();
  }

  getmyprofiledetails() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'account/Getmyprofileupdate/' + this.userdata.UserInfoId + '').then((result) => {
      this.myprofile = result;
      this.presentLoadingDefault(false);
      if (this.myprofile.length > 0) {
        this.myprofilecount = 1;
      } else {
        console.log("No data found.");
      }
    }, (err) => {
      this.presentToast(err);
    });
  }

  getImage(row_no, item: any) {
    let objFile = this.myprofile.find(o => o.ID === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];

    if (extn == "jpg" || extn == "jpeg" || extn == "png") {
      if (this.myprofile.length > 0) {
        return `data:image/${extn};base64,${this.encode(bytes)}`;
      } else {
        return `./assets/imgs/no-found-photo.png`
      }
    }
  }


  getProfileImages() {
    
    let bytes = this.imageURI;
    let extn  = 'jpeg';
    if (extn == "jpg" || extn == "jpeg" || extn == "png") {
      if (this.myprofile.length > 0) {
        return `data:image/${extn};base64,${this.encode(bytes)}`;
      } else {
        return `./assets/imgs/no-found-photo.png`
      }
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


  onSelectFile(event) {
    let file = event.target.files;
    if (file[0].type == "image/png" || file[0].type == "image/jpg" || file[0].type == "image/jpeg") {
      this.file_name = file[0].name;
      this.size = file[0].size;
      let reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onloadend = (e) => {
        this.imageURI = reader.result;
        //console.log(this.imageURI);
        let id = '';
        this.Uploadmyprofile(id);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    } else {
      this.presentToast("Please select the correct format image");
    }
  }

  Uploadmyprofile(id: any) {

    var profile_id;

    if (this.myprofile.length > 0) {
      profile_id = this.myprofile[0].ID;
    }

    let data = {
      size_data: this.size,
      created_by: this.userdata.UserInfoId,
      modified_by: this.userdata.UserInfoId,
      imageURI_data: this.imageURI,
      name: this.file_name,
      userid: this.userdata.UserInfoId,
      ID: profile_id
    }
    debugger;
    this.authService.postData(data, 'account/myprofileupdate').then((result: any) => {

      if (result) {

        this.profileImg = 'http://flexion.fakhruddinproperties.com:8883/profile/' + this.userdata.UserInfoId + '/myimage.jpeg';

        this.ionViewDidLoad();        
        this.presentToast("Profile Update Successfully");
        this.upload_then_deletePhoto(id);

      }
    }, (err) => {      
      this.presentToast(err);
    });
    
  }

  openBrowser() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Option',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Take photo',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Choose photo from Gallery',
          icon: !this.platform.is('ios') ? 'ios-images-outline' : null,
          handler: () => {
            this.openGallery();
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50, 
      destinationType: this.camera.DestinationType.DATA_URL,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      //this.photos.push(this.base64Image);
      this.imageURI = this.base64Image;
      this.myImage  = this.base64Image;
      //this.photos.reverse();
      this.show_profile_image = 1;
      this.show_profile_image_crop = 0;
    }, (err) => {
      console.log(err);
    });
  }

  openGallery() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      //this.photos.push(this.base64Image);
      this.imageURI = this.base64Image;
      this.myImage  = this.base64Image;
      //this.photos.reverse();      
      this.show_profile_image = 1;
      this.show_profile_image_crop = 0;
    }, (err) => {
      // Handle error
    })
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this photo? There is NO undo!',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  upload_then_deletePhoto(index) {
    this.photos.splice(index, 1);
  }

  showimage(row_no, item: any) {

    let objFile = this.myprofile.find(o => o.ID === row_no);
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    this.downloadUrl = new Blob([new Uint8Array(item.FILE_CONTENT.data)]);
    let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
    this.saveAndOpenPdf(this.downloadUrl, file_name, content_type[0]);
  }

  saveAndOpenPdf(pdf: any, filename: any, content_type: any) {
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    this.file.writeFile(writeDirectory, filename, pdf, { replace: true })
      .then(() => {
        
        this.fileOpener.open(writeDirectory + filename, content_type.type)
          .catch(() => {
            console.log('Error opening pdf file');
            
          });
      })
      .catch(() => {
        console.error('Error writing pdf file');
        
      });
  }

  updatePassword() {
    let update_data = this.updatePasswordForm.value;
    update_data.userInfoId = this.userdata.UserInfoId;
    console.log('update_data ',update_data);
    this.presentLoadingDefault(true);
    this.authService.postData(update_data, 'account/UpdatePassword').then((result:any) => {
      let isSuccess = result.result;
      this.updatePasswordForm.reset();
      this.presentLoadingDefault(false);
      if(isSuccess == 1){
        this.presentToast('Password update successfully');
      }else{
        this.presentToast('Password update failed');
      }
    }, (err) => {
      this.presentToast(err);
    });
  }

  presentLoadingCustom(show) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img width = 50 height= 50 src="assets/imgs/logo.jpeg" />`,
      duration: 5000
    });

    if (show) {
      loading.present();
    }else {
      loading.dismissAll();
      loading = null
    }
  }



}
