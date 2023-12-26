import { Component } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Constant } from '../../providers/constant/constant'

/**
 * Generated class for the Call Management page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({

  templateUrl: 'lpoattachement.html',
})
export class  lpoattachement{
  callManagementDetails : any;
  callcommentsForm:FormGroup
  CallinspectionList:any;
  WORK_NOT_STARTED:any;
  WORK_IN_PROGRESS:any;
  PARTIALLY_ASSIGNED:any;
  Lpomanament_data:any;
  ResourseList:any;
  type:any;
  ImageList:any;
  image_list='none';
  imagelistdata:any;
  downloadUrl:any;
  file_name:any;
  size:any;
  imageURI:any;
  LPO_ID:any;
  imagelistdatacount:any;
  storageDirectory:any;
  searchData = {"search_value": ""};
  pdfSrc: string = 'assets/sample-file.pdf';
  LpoID = this.navParams.get('data');
  user : any = localStorage.getItem('userData');
  constructor(public platform: Platform ,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService:RestProvider, public toastCtrl:ToastController,private file: File,private fileOpener: FileOpener,
    public loadingCtrl: LoadingController, public view: ViewController, public constant:Constant) {
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

  onCloseHandimage_list(){
    this.image_list='none'; 
  }
  
  ngOnInit() {   
   this.imagelistdata = this.LpoID[0].ImageList;
   this.LPO_ID = this.LpoID[0].LPO_ID;
   if(this.imagelistdata.length > 0){
    this.imagelistdatacount = 1; 
   }else{
    this.imagelistdatacount = 0; 
   }
      //console.log(this.constant.fileTypes);
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

  closeModal() {
    this.view.dismiss();
  }


getImagelist(row_no,item:any){

    let objFile = this.imagelistdata.find(o => o.ROW_NO === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
  
  if (extn == "gif" || extn =="jpeg" || extn =="png") {
    if(this.imagelistdata.length > 0){
      return `data:image/${extn};base64,${this.encode(bytes)}`;
    }else{
      return `./assets/imgs/no-found-photo.png`
    }
  } 
}

saveAndOpenPdf(pdf: any, filename: any,content_type:any) {
  const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
  this.file.writeFile(writeDirectory, filename, pdf, {replace: true})
    .then(() => {
        this.loading.dismiss();
        this.fileOpener.open(writeDirectory + filename, content_type.type)
            .catch(() => {
                console.log('Error opening pdf file');
                this.loading.dismiss();
            });
    })
    .catch(() => {
        console.error('Error writing pdf file');
        this.loading.dismiss();
    });
}

getfile(row_no,item:any){
      
  let objFile = this.imagelistdata.find(o => o.ROW_NO === row_no);
 // let bytes = objFile.FILE_CONTENT.data;
 // let file_type = objFile.FILE_TYPE;
  let file_name = objFile.FILE_NAME;
  let nameSplit = file_name.split('.');
  let extn = nameSplit[nameSplit.length - 1];
  this.downloadUrl = new Blob([new Uint8Array(item.FILE_CONTENT.data)]);
  let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
  this.saveAndOpenPdf(this.downloadUrl,file_name,content_type[0]);
  // const a = document.createElement('a');
  // a.setAttribute('style', 'display:none;');
  // document.body.appendChild(a);

  // a.href = this.downloadUrl;
  // a.download = file_name;
  // a.click();
  //return `data:application/${extn};base64,${this.encode(bytes)}`;
  // if(file_type == 'IMAGE'){
  //   return `data:application/${extn};base64,${this.encode(bytes)}`;
  // }else{
  //   return `./assets/imgs/no-found-photo.png`
  // }
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

onLowestFile(event){
    let file = event.target.files;
      this.file_name = file[0].name;
    this.size = file[0].size;
     let reader = new FileReader();
     reader.readAsDataURL(file[0]);
     reader.onloadend = (e) => {
       this.imageURI = reader.result;
      this.Lowestfileupload(this.file_name,this.size,this.imageURI);
     };
     reader.onerror = function (error) {
       console.log('Error: ', error);
     };
}
Lowestfileupload(file_name,size,imageURI){
    let data = {
        imageURI_data : imageURI,
        name : file_name,
        size_data : size,
        type : 'LPO LOWEST QUOTE',
        LPO_ID:this.LPO_ID,
        created_by : this.user.UserInfoId,
        modified_by : this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data,'lpo/Insertcommonattach').then((result) => {
      this.presentLoadingDefault(false);
      this.Getlpoattachlist();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
}


onLowerFile(event){
    let file = event.target.files;
      this.file_name = file[0].name;
    this.size = file[0].size;
     let reader = new FileReader();
     reader.readAsDataURL(file[0]);
     reader.onloadend = (e) => {
       this.imageURI = reader.result;
      this.Lowerfileupload(this.file_name,this.size,this.imageURI);
     };
     reader.onerror = function (error) {
       console.log('Error: ', error);
     };
}
Lowerfileupload(file_name,size,imageURI){
    let data = {
        imageURI_data : imageURI,
        name : file_name,
        size_data : size,
        type : 'LPO LOWER QUOTE',
        LPO_ID:this.LPO_ID,
        created_by : this.user.UserInfoId,
        modified_by : this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data,'lpo/Insertcommonattach').then((result) => {
      this.presentLoadingDefault(false);
      this.Getlpoattachlist();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
}
Getlpoattachlist(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'Lpo/Getallcommantattach/'+this.LPO_ID+'').then((result) => {
      this.presentLoadingDefault(false);
      this.imagelistdata = result;
    }, (err) => {
        this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
      });
}
}
