import { Component,ChangeDetectorRef  } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams,ToastController,LoadingController,ViewController,AlertController} from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { IonicSelectableComponent } from 'ionic-selectable';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { Constant } from '../../providers/constant/constant'
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-callinspectiondetails',
  templateUrl: 'callinspectiondetails.html',
})
export class callinspectiondetails {
  public photos : any;
  display='none';
  isChecked = 'true'
  material_list='none';
  material_modal='none';
  add_labour='none';
  add_labour_checkbox='none';
  image_list='none';
  COMPLAINT_ID = '';
  CALL_LOG_ID = '';
  public base64Image : string;
  calinspectionForm:FormGroup;
  calinspectionmaterialForm:FormGroup;
  calinspectionlabourForm:FormGroup;
  material_category :any;
  add_or_edit_labour:any;
  checkboxModel = {"value2": ""};
  designation:any;
  insertedValues:any;
  callinspectionmaterial:any;
  callinspectionlabour:any;
  callinspectiondetailsdelete:any;
  Createcall:any;
  file_name:any= [];
  size:any= [];
  formData:any;
  imageURI:any= [];
  material_check:any;
  MATERIAL_CATEGORY_ID:any;
  imagelistdata:any;
  downloadUrl:any;
  MATERIAL_CATEGORY_CODE:any ="";
  MaterialSpecification_value:any;
  call_create_details:any;
  callcomplientsdetails:any;
    callinstepctiondetails = this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    constructor(public platform: Platform ,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,public loadingCtrl: LoadingController,
        public view: ViewController,private alertCtrl : AlertController,private cdr: ChangeDetectorRef,private camera : Camera
        ,private file: File,private fileOpener: FileOpener, public constant:Constant) {
            this.user = this.user ? JSON.parse(this.user) : {};
            this.calinspectionForm = this.formBuilder.group({
              CALL_LOG_ID: [''],
              STATUS_ID: [''],
              COMPLAINTS: [''],
              complaint: [''],
              comments: ['', Validators.compose([Validators.required])],
              material: [''],
              MaterialSpecification: [''],
              Quantity: [''],
              Rate: [''],
              Contiguous: [''],
              material_required: [''],
              add_or_edit_labour: [''],
              Time_Frame: [''],
              no_of_person: [''],
              designation: [''],
              thired_party: [''],
              photo: [''],
              CALL_INSPECTION_DETAILS_ID: [''],
              CALL_INSPECTION_ID:['']
            }); 

            this.calinspectionmaterialForm = this.formBuilder.group({
              CALL_ESTIMATION_ID: ['', Validators.compose([Validators.required])],
              ASSIGNEDID: ['', Validators.compose([Validators.required])],
              BUILDING_ID: ['', Validators.compose([Validators.required])],
              material: ['', Validators.compose([Validators.required])],
              MaterialSpecification: ['', Validators.compose([Validators.required])],
              Quantity: ['', Validators.compose([Validators.required])],
              LOCATION_ID : ['', Validators.compose([Validators.required])],
              UNIT_ID: ['', Validators.compose([Validators.required])],
              COMPLAINT_ID: ['', Validators.compose([Validators.required])],
              CALL_LOG_ID:['', Validators.compose([Validators.required])]
            }); 

            this.calinspectionlabourForm = this.formBuilder.group({
              CALL_ESTIMATION_ID: ['', Validators.compose([Validators.required])],
              ASSIGNEDID: ['', Validators.compose([Validators.required])],
              designation: ['', Validators.compose([Validators.required])],
              no_of_person: ['', Validators.compose([Validators.required])],
              Time_Frame: ['', Validators.compose([Validators.required])],
              COMPLAINT_ID: ['', Validators.compose([Validators.required])],
              CALL_LOG_ID:['', Validators.compose([Validators.required])]
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
  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
 }
  ionViewWillLoad() {
    this.photos = [];
    this.material_list='none';
    this.getMATERIAL_CATEGORY();
    this.getdesingation();
    this.call_create_details = this.callinstepctiondetails[0].Inspection[0];
   this.getcallCompliantdetails(this.callinstepctiondetails[0].Inspection[0].CALL_LOG_ID);
  }
  getcallCompliantdetails(CALL_LOG_ID){
    this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/CallCompliantdetails/'+CALL_LOG_ID+'').then((result) => {
      this.presentLoadingDefault(false);
      this.callcomplientsdetails = result;
        this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(`Something Went Wrong`);
    });
  }
  
  getMATERIAL_CATEGORY(){
    this.authService.getData({}, 'Call_inspection/CallinspectionMaterialList').then((result) => {
      this.presentLoadingDefault(false);
      this.material_category = result;
      if (this.material_category.length > 0) {
        /*console.log('Material Category ', this.material_category); */       
      } else {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }


  getdesingation(){
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'Call_inspection/CalldesingationList').then((result) => {
      this.designation = result;
      if (this.designation.length > 0) {
        /*console.log('Designation ', this.designation); */       
      } else {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }
  resetForm(){
    this.calinspectionForm.reset();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  insertlabourData(){

    let Labourinsertata = this.calinspectionlabourForm.value;
    if(this.calinspectionlabourForm.value.Time_Frame == undefined && this.calinspectionlabourForm.value.no_of_person == undefined){
      Labourinsertata.Time_Frame = "1 Hour";
      Labourinsertata.no_of_person = "1";
    }
    Labourinsertata.created_by= this.user.UserInfoId;
    Labourinsertata.modified_by= this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(Labourinsertata,'Call_inspection/Callinspectionlabourinsert').then((result) => {
      this.presentLoadingDefault(false);

      this.getlabourdata(this.calinspectionmaterialForm.value.COMPLAINT_ID,this.calinspectionmaterialForm.value.CALL_LOG_ID);

      this.presentToast("Labour successfully created");
      this.insertedValues = result;
     /*console.log('List ',this.insertedValues);*/
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }
  materialChange(event: {
    component: IonicSelectableComponent,
    value: any 
  }) {
    this.MATERIAL_CATEGORY_ID = event.value.MATERIAL_CATEGORY_ID;
    let code = this.material_category.filter(call => call.MATERIAL_CATEGORY_ID === event.value.MATERIAL_CATEGORY_ID);
    this.MATERIAL_CATEGORY_CODE = code;
  }

  // MaterialSpecification(event: {
  //   component: IonicSelectableComponent,
  //   value: any 
  // }) {
  //   this.MaterialSpecification_value = event.value.MATERIAL_CATEGORY_ID;
  // }

  insertmaterial(){    
    let Materialinsertata = this.calinspectionmaterialForm.value;
    Materialinsertata.material= this.MATERIAL_CATEGORY_ID;
   // Materialinsertata.MaterialSpecification = this.MaterialSpecification_value;
    Materialinsertata.created_by= this.user.UserInfoId;
    Materialinsertata.modified_by= this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(Materialinsertata,'Call_inspection/Callinspectionmaterialinsert').then((result) => {
      this.presentLoadingDefault(false);
      this.getmaterialdata(this.calinspectionmaterialForm.value.COMPLAINT_ID,this.calinspectionmaterialForm.value.CALL_LOG_ID);
      this. material_list ='none';
      this.presentToast("Material successfully created");
      this.insertedValues = result;
     /* console.log('List ',this.insertedValues); */
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
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

  openModal(){
    this.display='block'; 
 }

 openModalMaterial(){
  this.material_modal='block'; 
}

 onCloseHandled(){
  this.display='none';
}

onCloseMaterial(){
  this.material_modal='none'; 
}

onCloseHandledlabour(){
  this.add_labour='none'; 
}

onCloseHandledmaterial(){
  this.material_list='none'; 
}
onCloseHandimage_list(){
  this.image_list='none'; 
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

getmaterialdata(COMPLAINT_ID:any,CALL_LOG_ID:any){
  this.presentLoadingDefault(false);
  let CreatecallData = this.calinspectionForm.value;
  CreatecallData.COMPLAINT_ID = COMPLAINT_ID;
  CreatecallData.CALL_LOG_ID = CALL_LOG_ID;
    this.COMPLAINT_ID = COMPLAINT_ID;
    this.CALL_LOG_ID = CALL_LOG_ID;

      this.authService.postData(CreatecallData,'Call_inspection/Callinspectionmaterialdetails/').then((result) => {
       // this.navCtrl.setRoot(this.navCtrl.getActive().component);
        this.material_list='block'; 
      this.presentLoadingDefault(false);
      this.callinspectionmaterial = result;
      if(this.callinspectionmaterial.length>0){
        this.presentLoadingDefault(false);
        /* console.log('List data',this.callinspectionmaterial); */
      }else{
        this.presentToast(`No data found`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(`Something Went Wrong`);
    });
}

showlabouradd(COMPLAINT_ID:any,CALL_LOG_ID:any){
  this.getlabourdata(COMPLAINT_ID,CALL_LOG_ID);
}
showlabourcheckbox(COMPLAINT_ID:any,CALL_LOG_ID:any){
  let Createlabour = this.calinspectionForm.value;
  if(Createlabour.add_or_edit_labour == true){
    this.getlabourdata(COMPLAINT_ID,CALL_LOG_ID);
  }
}

showmaterialcheckbox(COMPLAINT_ID:any,CALL_LOG_ID:any,event:any){
  if(event.currentTarget.checked == true){
    this.material_check = 1;
    this.getmaterialdata(COMPLAINT_ID,CALL_LOG_ID)
  }else{
    this.material_check = 0;
  }
}

getlabourdata(COMPLAINT_ID:any,CALL_LOG_ID:any){
  let CreatecallData = this.calinspectionForm.value;
  CreatecallData.COMPLAINT_ID = COMPLAINT_ID;
  CreatecallData.CALL_LOG_ID = CALL_LOG_ID;
    this.COMPLAINT_ID = COMPLAINT_ID;
    this.CALL_LOG_ID = CALL_LOG_ID;
    
      this.authService.postData(CreatecallData,'Call_inspection/Callinspectionlabourdetails/').then((result) => {
        this.add_labour='block';
      this.presentLoadingDefault(false);
      this.callinspectionlabour = result[0];
      if(this.callinspectionlabour.length>0){
        this.presentLoadingDefault(false);
       /* console.log('List labour',this.callinspectionlabour); */
      }else{
        this.presentToast(`No data found`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(`Something Went Wrong`);
    });
}

show(COMPLAINT_ID:any,CALL_LOG_ID:any){
  this.getmaterialdata(COMPLAINT_ID,CALL_LOG_ID);
}

remove(CALL_ESTIMATION_ITEMS_ID:any,COMPLAINT_ID:any,CALL_LOG_ID:any){
  
this.authService.postData({},'Call_inspection/Callinspectionmaterialdelete/'+CALL_ESTIMATION_ITEMS_ID+'').then((result) => {
  this.presentLoadingDefault(false);
  this.callinspectiondetailsdelete = result;
  this.getmaterialdata(COMPLAINT_ID,CALL_LOG_ID);

  if(this.callinspectiondetailsdelete.length>0){
    this.presentLoadingDefault(false);
    this.resetdata();
    this.getmaterialdata(COMPLAINT_ID,CALL_LOG_ID);

  }else{
    this.getmaterialdata(COMPLAINT_ID,CALL_LOG_ID);
    this.presentToast(`No data found`);
  }
}, (err) => {
  this.presentLoadingDefault(false);
  this.presentToast(`Something Went Wrong`);
});
}
resetdata(){
  this.calinspectionmaterialForm;
}

removelabour(CALL_ESTIMATION_LABOUR_ID:any,COMPLAINT_ID:any,CALL_LOG_ID:any){
  this.presentLoadingDefault(true);
  let modified_by = this.user.UserInfoId;
  let data={CALL_ESTIMATION_LABOUR_ID,modified_by}
  this.authService.postData(data,'Call_inspection/Callinspectionlabourdelete/').then((result) => {
    this.presentLoadingDefault(false);
    this.callinspectiondetailsdelete = result;
    this.getlabourdata(COMPLAINT_ID,CALL_LOG_ID);
  
    if(this.callinspectiondetailsdelete.length>0){
      this.presentLoadingDefault(false);
      this.resetdataform();
      this.getlabourdata(COMPLAINT_ID,CALL_LOG_ID);
  
    }else{
      this.getlabourdata(COMPLAINT_ID,CALL_LOG_ID);
      this.presentToast(`No data found`);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast(`Something Went Wrong`);
  });
  }
  resetdataform(){
    this.calinspectionlabourForm;
  }
  insertCallinspectionData(){
    this.presentLoadingDefault(true);
    let CreatecallData = this.calinspectionForm.value;
    CreatecallData.material_check = this.material_check;
    CreatecallData.imageURI_data = this.imageURI;
    CreatecallData.name = this.file_name;
    CreatecallData.size_data = this.size;
    CreatecallData.modified_by = this.user.UserInfoId;
    CreatecallData.created_by = this.user.UserInfoId;
    this.authService.postData(CreatecallData,'Call_inspection/editandupdate/').then((result) => {
      this.Createcall = result;
      this.closeModal();
      this.presentToast("Updated Successfully");
      this.presentLoadingDefault(false);
      if(this.Createcall.length > 0){
        this.presentLoadingDefault(false);
       /* console.log('comments ',this.Createcall);*/
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }
  THIREDPARTY(COMPLAINT_ID:any,datadetails = [] as any,CALL_INSPECTION_DETAILS_ID:any){
    this.presentLoadingDefault(true);
    let CreatecallData = this.calinspectionForm.value;
    if(CreatecallData.thired_party == true){
      CreatecallData.CALL_INSPECTION_ID = datadetails.CALL_INSPECTION_ID;
      CreatecallData.STATUS_ID = datadetails.STATUS_ID;
      CreatecallData.MREQUIRED = datadetails.MREQUIRED;
      CreatecallData.COMPLAINT_ID = COMPLAINT_ID;
      CreatecallData.CALL_INSPECTION_DETAILS_ID = CALL_INSPECTION_DETAILS_ID;
      CreatecallData.modified_by = this.user.UserInfoId;
      CreatecallData.created_by = this.user.UserInfoId;
      this.authService.postData(CreatecallData,'Call_inspection/INSP_DETAILS_INSERT_NEW/').then((result) => {
        this.Createcall = result;
        this.presentLoadingDefault(false);
        if(this.Createcall.length > 0){
          this.presentLoadingDefault(false);
         /* console.log('comments ',this.Createcall);*/
        }else{
          this.presentLoadingDefault(false);
        }
      }, (err) => {
        this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
      });
    }
  }

  imagelist(CALL_LOG_ID:any){
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'Call_inspection/CallinspectiondetailsimageList/'+CALL_LOG_ID+'').then((result) => {
      this.imagelistdata = result;
      this.presentLoadingDefault(false);
      this.image_list='block'; 
      if (this.designation.length > 0) {
       /* console.log('imagelist ', this.imagelistdata); */       
      } else {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  onSelectFile(event){
    let file = event.target.files;
    for(let i=0;i<file.length;i++){
      this.file_name.push(file[i].name);
    this.size.push(file[i].size);
     let reader = new FileReader();
     reader.readAsDataURL(file[i]);
     reader.onloadend = (e) => {
       this.imageURI.push(reader.result);
     };
     reader.onerror = function (error) {
       console.log('Error: ', error);
     };
    }
  }

  getImagelist(CALL_FILES_ID,item:any){

    let objFile = this.imagelistdata.find(o => o.CALL_FILES_ID === CALL_FILES_ID);
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

getfile(CALL_FILES_ID,item:any){
      
  let objFile = this.imagelistdata.find(o => o.CALL_FILES_ID === CALL_FILES_ID);
  //let bytes = objFile.FILE_CONTENT.data;
  //let file_type = objFile.FILE_TYPE;
  let file_name = objFile.FILE_NAME;
  let nameSplit = file_name.split('.');
  let extn = nameSplit[nameSplit.length - 1];
  this.downloadUrl = new Blob([new Uint8Array(item.FILE_CONTENT.data)]);
  let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
  this.saveAndOpenPdf(this.downloadUrl,file_name,content_type[0]);
  
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
        this.imageURI.push(this.base64Image);
        this.photos.reverse();
      }, (err) => {
        console.log(err);
      });
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
}