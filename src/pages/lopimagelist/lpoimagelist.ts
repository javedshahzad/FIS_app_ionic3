import { Component } from '@angular/core';
import { IonicPage, Platform,NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Constant } from '../../providers/constant/constant'


@IonicPage()
@Component({

  templateUrl: 'lpoimagelist.html',
})
export class lpoimagelist {
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
  WORK_WAITING_FOR_CLIENT_APPROVAL:any;
  imagelistdatacount:any;
  searchData = {"search_value": ""};
  LpoImagelist = this.navParams.get('data');
  user : any = localStorage.getItem('userData');
  module_name = '';
  
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
   //console.log('lpoimagelist',this.LpoImagelist);
   this.module_name = this.LpoImagelist[0].page_name;
   this.imagelistdata = this.LpoImagelist[0].ImageList;
   if(this.imagelistdata.length > 0){
    this.imagelistdatacount = 1; 
   }else{
    this.imagelistdatacount = 0; 
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

  closeModal() {
    this.view.dismiss();
  }


getImagelist(row_no,item:any){

    let objFile = this.imagelistdata.find(o => o.ROW_NO === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    extn = extn ? extn.toLowerCase():'';
    
    if(this.imagelistdata.length > 0){
      if (extn == "gif" || extn =="jpeg" || extn=='jpg' || extn =="png") {
        return `data:image/${extn};base64,${this.encode(bytes)}`;
      }else if(extn == "xlsx" || extn == "xls"){
        return `./assets/imgs/excel-thumbnail.png`
      }else if(extn == "doc" || extn == "docx"){
        return `./assets/imgs/word-thumbnail.jpg`
      }else if(extn == "ppt"){
        return `./assets/imgs/ppt-thumbnail.png`
      }else if(extn =='pdf'){
        return `./assets/imgs/PDF-thumbnail.png`
      }else if(extn =='mp4' || extn =='m4a' || extn =='m4v' || extn =='f4v' || extn =='f4a' || extn =='m4b'||extn =='m4r'||extn =='f4b'||extn =='mov'||extn =='3gp'||extn =='3gp2'||extn =='3g2'||extn =='3gpp'||extn =='3gpp2'||extn =='ogg'||extn =='oga'||extn =='ogv'||extn =='ogx'||extn =='wmv'||extn =='wma'||extn =='asf*'){
        return `./assets/imgs/video-thumbnail.jpg`
      }else{
        return `./assets/imgs/unknown.png`
      }
    } else{
      return `./assets/imgs/no-found-photo.png`
    }
}
      
saveAndOpenPdf(pdf: any, filename: any,content_type:any) {
  const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
  this.file.writeFile(writeDirectory, filename, pdf, {replace: true})
    .then(() => {
     //   this.loading.dismiss();
        this.fileOpener.open(writeDirectory + filename, content_type.type)
            .catch(() => {
                console.log('Error opening file');
                this.loading.dismiss();
            });
    })
    .catch(() => {
        console.error('Error writing file');
        this.loading.dismiss();
    });
}

getfile(row_no,item:any){
      
  let objFile = this.imagelistdata.find(o => o.ROW_NO === row_no);
  //let bytes = objFile.FILE_CONTENT.data;
  //let file_type = objFile.FILE_TYPE;
  let file_name = objFile.FILE_NAME;
  let nameSplit = file_name.split('.');
  let extn = nameSplit[nameSplit.length - 1];
  this.downloadUrl = new Blob([new Uint8Array(item.FILE_CONTENT.data)]);
  let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
  this.saveAndOpenPdf(this.downloadUrl,file_name,content_type[0]);
  
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
}
