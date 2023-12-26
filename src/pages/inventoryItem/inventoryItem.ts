import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams ,Platform, ModalController,AlertController,ToastController,ActionSheetController,LoadingController } from 'ionic-angular';
import { ItemlistModelPage } from '../itemlist-model/itemlist-model';
import { RestProvider } from '../../providers/rest/rest';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Slides} from 'ionic-angular'

/**
 * Generated class for the InventoryitemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inventoryItem',
  templateUrl: 'inventoryItem.html',
})
export class InventoryItemPage {
  user: any = localStorage.getItem('userData');
  userdata : any = JSON.parse(this.user);
  category_id: any;
  categorydata:any;
  inventoryList : any;
  imagelist:any;
  imagecount = 0 ;
  downloadUrl:any;
  categoryimages:any;
  sourcedata:any;
  storesdata:any;
  StoreList_all:any;
  StoreList:any;
  mySlideOptions = {
    pager:true
  };
  public photos :any= [];
  size:any;
  file_name:any;
  imageURI:any;
  public base64Image : string;
  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modelCtrl:ModalController,
    public loadingCtrl: LoadingController, public platform: Platform,private camera : Camera,
    private alertCtrl : AlertController,private actionsheetCtrl: ActionSheetController,
    public authService:RestProvider, public toastCtrl:ToastController) {
  }
 

  ngOnInit() {
  //  console.log('ionViewDidLoad');
    this.category_id = this.navParams.get('category_id');
    this.getstoresbycategoryid(this.category_id);
    this.getimagelist(this.category_id[0]);
    // this.InventoryimageByitemId(this.category_id[0].ITEM_ID);
    if(!this.category_id)
      this.navCtrl.pop();
  }

  getstoresbycategoryid(category_id:any){
    this.presentLoadingDefault(true);
    this.categorydata ={
      stores_id : category_id[1],
      category_id : category_id[0]
    }
    this.authService.postData(this.categorydata,'inventory/getinventoryitemlistbystores').then((result) => {
      this.sourcedata = result[0];
      this.storesdata = result[1];
     // console.log(this.sourcedata);
    //  console.log(this.storesdata);
      this.presentLoadingDefault(false);
      if(this.sourcedata.length == 0){
        this.presentToast(`No data found`);
      }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  InventoryimageByitemId(ITEM_ID:any){
    this.authService.getData({},'inventory/stock_storeWise/'+ITEM_ID+'').then((result) => {
      this.StoreList_all = result;
      this.StoreList = this.StoreList_all.filter(item => item.ITEM_ID == ITEM_ID);
      //console.log('storelist',this.StoreList);
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
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
isImage = false;
  getimagelist(ITEM_ID:any){
    //this.presentLoadingDefault(true);
    this.authService.getData({},'inventory/inventoryimagelist/'+ITEM_ID+'').then((result) => {
      this.imagelist = result;
      this.isImage = true;
      this.imagecount = this.imagelist.length;
     // if(this.imagelist.length > 0){
      //  this.imagecount =1;
       // this.presentLoadingDefault(false);
        //console.log('imagelist ',this.imagelist);
     // }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  onSelectFile(event){
    let file = event.target.files;
    if(file[0].type =="image/png" || file[0].type =="image/jpg" || file[0].type =="image/jpeg"){
      this.file_name = file[0].name;
      this.size = file[0].size;
       let reader = new FileReader();
       reader.readAsDataURL(file[0]);
       reader.onloadend = (e) => {
         this.imageURI = reader.result;
         //console.log(this.imageURI);
         let id ='';
         this.Uploadimage(id);
       };
       reader.onerror = function (error) {
         console.log('Error: ', error);
       };
    }else{
      this.presentToast("Please select the correct format image");
    }
  }

  getImage(MATERIAL_CATEGORY_IMAGEID){
    let objFile = this.imagelist.find(o => o.MATERIAL_CATEGORY_IMAGE_ID === MATERIAL_CATEGORY_IMAGEID);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    if(this.imagelist.length > 0){
      return `data:image/${extn};base64,${this.encode(bytes)}`;
    }else{
      return `./assets/imgs/no-found-photo.png`
    }
  }

  encode (input) {
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


  OpenModel(type,itemId){
    let myTitle;
    let item_Id; 
    item_Id = itemId;
    
    if(type == 'IN'){
        myTitle = 'In Item List';
    }else{
        myTitle = 'Out Item List';
    }

      if(item_Id){
        this.authService.getData({},'inventory/getInventoryItemList/'+item_Id+'/'+type).then((result) => {
            this.inventoryList = result;
            if(this.inventoryList.length > 0){
             // console.log('List ',this.inventoryList);
              
              const modal = this.modelCtrl.create(ItemlistModelPage,{title: myTitle,item_list: this.inventoryList });
              modal.present();
            }else{
              this.presentToast(`No data found in ${myTitle}`);
            }
      }, (err) => {
        this.presentToast("Something went to wrong, please try again later");
      });
      }   
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  openBrowser(){
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
        },{
          text: 'Cancel',
          role: 'cancel'
        }
  ]
});
actionSheet.present();
}

takePhoto() {
  const options : CameraOptions = {
    quality: 50, // picture quality
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  this.camera.getPicture(options) .then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.imageURI = this.base64Image;
      this.photos.reverse();
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
         // imageData is either a base64 encoded string or a file URI
         // If it's base64:
         this.base64Image  = 'data:image/jpeg;base64,' + imageData;
         this.photos.push(this.base64Image);
         this.imageURI = this.base64Image;
        this.photos.reverse();
      }, (err) => {
         // Handle error
       })}

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

      Uploadimage(id :any){
        this.presentLoadingDefault(true);
        this.category_id = this.navParams.get('category_id');
        var c_id = this.category_id[0];
        var profile_id;
        if(this.imagelist.length > 0){
          profile_id = this.imagelist[0].c_id;
        }
        let data ={
          size_data : this.size,
          created_by : this.userdata.UserInfoId,
          modified_by : this.userdata.UserInfoId,
          imageURI_data : this.imageURI,
          name : this.file_name,
          userid : this.userdata.UserInfoId,
          ID : profile_id,
          category_id : c_id
        }
        this.authService.postData(data, 'inventory/imageupload').then((result: any) => {
          this.category_id = this.navParams.get('category_id');
          this.getstoresbycategoryid(this.category_id);
          this.getimagelist(this.category_id[0]);
          if(result){
            this.presentLoadingDefault(false);
            this.presentToast("Profile Update Successfully"); 
            this.upload_then_deletePhoto(id);
          }      
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast("Something went to wrong, please try again later");
        });
      }

  getfile(MATERIAL_CATEGORY_IMAGE_ID:any,item:any){
      
    let objFile = this.imagelist.find(o => o.MATERIAL_CATEGORY_IMAGE_ID === MATERIAL_CATEGORY_IMAGE_ID);
    let bytes = objFile.FILE_CONTENT.data;
    let file_type = objFile.FILE_TYPE;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    this.downloadUrl = window.URL.createObjectURL(new Blob([new Uint8Array(item.FILE_CONTENT.data)]));
    //console.log('DataURL:', this.downloadUrl);
  
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
  
    a.href = this.downloadUrl;
    a.download = file_name;
    a.click();
    if(file_type == 'IMAGE'){
      return `data:image/${extn};base64,${this.encode(bytes)}`;
    }else{
      return `./assets/imgs/no-found-photo.png`
    }
  }

}

