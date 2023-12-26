import { Component ,ChangeDetectorRef} from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,ViewController,AlertController } from 'ionic-angular';
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
  selector: 'page-callestimationdetails',
  templateUrl: 'callestimationdetails.html',
})
export class callestimationdetails {
  users: any[] = [
    {
      id: 0,
      name: 'Percent (%)',
    },
    {
      id: 1,
      name: 'Direct Amount',
    },
  ];

  public photos : any;
  display='none';
  isChecked = 'true'
  material_list='none';
  updatemodelreason='none';
  add_labour='none';
  DESIGNATIONdata:any;
  LABOUR_COUNTdata:any;
  RATEdata:any;
  LABOUR_TIMEdata:any;
  TOTALdata:any;
  CALL_ESTIMATION_LABOUR_IDdata:any;
  CALL_ESTIMATION_DETAILS_IDdata:any;
  REASION1data:any;
  CALL_INSPECTION_DETAILS_IDdata:any;
  CALL_LOG_IDdata:any;
  updatemodeldesignation='none';
  updatematerialstyle='none';
  M_SPECIFICATIONmaterial:any;
  QUANTITYmaterial:any;
  RATEmaterial:any;
  CALL_ESTIMATION_ITEMS_IDmaterial:any;
  COMPLAINT_ID = '';
  CALL_LOG_ID = '';
  public base64Image : string;
  calinspectionForm:FormGroup;
  calinspectionmaterialForm:FormGroup;
  calinspectionlabourForm:FormGroup;
  updatedesignationForm:FormGroup;
  updatereasonForm:FormGroup;
  updatematerialForm:FormGroup;
  openprofitForm:FormGroup;
  material_category :any;
  add_or_edit_labour:any;
  callmaterialdetails:any;
  checkboxModel = {"value2": ""};
  designation:any;
  insertedValues:any;
  callinspectionmaterial:any;
  callinspectionlabour:any =[];
  callinspectiondetailsdelete:any;
  openprofitmodelstyle = 'none';
  wholetotal=0;
  holetotaldata:any;
  final_data = 0;
  callinspectionlabour_amount:any;
  total_amount = 0;
  total_profit = 0;
  CONTIGUOUSvalue = 10;
  estimationdata:any;
  COMPLAINT_IDdata:any;
  DESIGNATION_IDdata:any;
  typevalue:any;
  meterial_in = 0;
  title : any;
  call_create_details:any;
  callcomplientsdetails:any;
  callestimationdetails = this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,private cdr: ChangeDetectorRef,
        public loadingCtrl: LoadingController, public view: ViewController,private alertCtrl : AlertController) {
            this.user = this.user ? JSON.parse(this.user) : {};
            this.calinspectionForm = this.formBuilder.group({
              complaint: ['', Validators.compose([Validators.required])],
              comments: ['', Validators.compose([Validators.required])],
              material: ['', Validators.compose([Validators.required])],
              MaterialSpecification: ['', Validators.compose([Validators.required])],
              Quantity: ['', Validators.compose([Validators.required])],
              Rate: ['', Validators.compose([Validators.required])],
              Contiguous: ['', Validators.compose([Validators.required])],
              material_required: ['', Validators.compose([Validators.required])],
              add_or_edit_labour: ['', Validators.compose([Validators.required])],
              Time_Frame: ['', Validators.compose([Validators.required])],
              no_of_person: ['', Validators.compose([Validators.required])],
              designation: ['', Validators.compose([Validators.required])]
            }); 

            this.updatedesignationForm = this.formBuilder.group({
              DESIGNATION: ['', Validators.compose([Validators.required])],
              LABOUR_COUNT: ['', Validators.compose([Validators.required])],
              RATE: ['', Validators.compose([Validators.required])],
              LABOUR_TIME: ['', Validators.compose([Validators.required])],
              TOTAL: ['', Validators.compose([Validators.required])],
              CALL_ESTIMATION_LABOUR_ID: ['', Validators.compose([Validators.required])],
              CALL_ESTIMATION_DETAILS_ID: ['', Validators.compose([Validators.required])],
              CALL_LOG_ID: ['', Validators.compose([Validators.required])],
              CONTIGUOUS: ['', Validators.compose([Validators.required])]
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

            this.updatereasonForm = this.formBuilder.group({
              CALL_INSPECTION_DETAILS_ID: ['', Validators.compose([Validators.required])],
              REASION1: ['', Validators.compose([Validators.required])]
            });
            
            this.updatematerialForm = this.formBuilder.group({
              CALL_ESTIMATION_ITEMS_ID: ['', Validators.compose([Validators.required])],
              M_SPECIFICATION: ['', Validators.compose([Validators.required])],
              QUANTITY: ['', Validators.compose([Validators.required])],
              RATE: ['', Validators.compose([Validators.required])],
              CONTIGUOUS: ['', Validators.compose([Validators.required])]
            }); 

            this.openprofitForm = this.formBuilder.group({
              Type: ['', Validators.compose([Validators.required])],
              value: ['', Validators.compose([Validators.required])],
              totaldata: ['', Validators.compose([Validators.required])]
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
    this.photos = [];
    this.material_list='none';
    this.meterial_in = 0;
    this.title = this.callestimationdetails[0].title;
    this.call_create_details = this.callestimationdetails[0].Inspection[0];
   if(this.callestimationdetails[0].type == undefined){
    this.typevalue = 0;
   }else{
    this.typevalue = this.callestimationdetails[0].type;
   }
    this.estimationdata = this.callestimationdetails[0].Inspection[0];
    this.getmaterialdata(this.callestimationdetails[0].Inspection[0].COMPLAINTCOUNT,this.callestimationdetails[0].Inspection[0].CALL_LOG_ID);
    this.getlabourdata(this.callestimationdetails[0].Inspection[0].COMPLAINTCOUNT,this.callestimationdetails[0].Inspection[0].CALL_LOG_ID);
    this.getcallCompliantdetails(this.callestimationdetails[0].Inspection[0].CALL_LOG_ID);
  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
 }
  getmaterialdetails(COMPLAINT_ID,CALL_LOG_ID){
    this.presentLoadingDefault(true);
    let materialdetails = this.updatereasonForm.value;
    materialdetails.COMPLAINT_ID= COMPLAINT_ID;
    materialdetails.CALL_LOG_ID= CALL_LOG_ID;
    this.authService.postData(materialdetails,'Call_inspection/Callmaterialdetails/').then((result) => {
      this.presentLoadingDefault(false);
      this.callmaterialdetails = result;
      /*console.log('material',this.callmaterialdetails);*/
      this.getlabourdata(this.callestimationdetails[0].Inspection[0].COMPLAINTCOUNT,this.callestimationdetails[0].Inspection[0].CALL_LOG_ID);
        this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(`Something Went Wrong`);
    });
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

      this.getmaterialdata(this.calinspectionmaterialForm.value.COMPLAINT_ID,this.calinspectionmaterialForm.value.CALL_LOG_ID);

      this.presentToast("Labour successfully created");
      this.insertedValues = result;
    /* console.log('List ',this.insertedValues);*/
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }
  insertmaterial(){    
    let Materialinsertata = this.calinspectionmaterialForm.value;
    Materialinsertata.created_by= this.user.UserInfoId;
    Materialinsertata.modified_by= this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(Materialinsertata,'Call_inspection/Callinspectionmaterialinsert').then((result) => {
      this.presentLoadingDefault(false);

      this.getmaterialdata(this.calinspectionmaterialForm.value.COMPLAINT_ID,this.calinspectionmaterialForm.value.CALL_LOG_ID);

      this.presentToast("Material successfully created");
      this.insertedValues = result;
    /* console.log('List ',this.insertedValues);*/
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
  this.updatemodelreason='block'; 
}

 onCloseHandled(){
  this.display='none';
}

onCloseMaterial(){
  this.updatemodelreason='none'; 
}

onCloseHandledlabour(){
  this.updatemodeldesignation='none'; 
}

onCloseHandledmaterial(){
  this.material_list='none'; 
}
onCloseopenprofitmodel(){
  this.openprofitmodelstyle='none'; 
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

getmaterialdata(COMPLAINT_ID:any,CALL_LOG_ID:any){
  let CreatecallData = this.calinspectionForm.value;
  CreatecallData.COMPLAINT_ID = COMPLAINT_ID;
  CreatecallData.CALL_LOG_ID = CALL_LOG_ID;
    this.COMPLAINT_ID = COMPLAINT_ID;
    this.CALL_LOG_ID = CALL_LOG_ID;

      this.authService.postData(CreatecallData,'Call_inspection/Callinspectionmaterialdetailscall/').then((result:any) => {
      this.presentLoadingDefault(false);
      if(result.length>0){
        this.meterial_in = 1;
        this.callinspectionmaterial = result;
       /* console.log('List data',this.callinspectionmaterial);*/
      }else{
       // this.presentToast(`No data found`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(`Something Went Wrong`);
    });
    this.material_list='block';
 
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

showmaterialcheckbox(COMPLAINT_ID:any,CALL_LOG_ID:any){
  let Createlabour = this.calinspectionForm.value;
  if(Createlabour.add_or_edit_labour == true){
    this.getmaterialdata(COMPLAINT_ID,CALL_LOG_ID)
  }
}

getlabourdata(COMPLAINT_ID:any,CALL_LOG_ID:any){
  let CreatecallData = this.calinspectionForm.value;
  CreatecallData.COMPLAINT_ID = COMPLAINT_ID;
  CreatecallData.CALL_LOG_ID = CALL_LOG_ID;
    this.COMPLAINT_ID = COMPLAINT_ID;
    this.CALL_LOG_ID = CALL_LOG_ID;
    
      this.authService.postData(CreatecallData,'Call_inspection/Callestimationlabourdetails/').then((result) => {
      this.presentLoadingDefault(false);
     // let Labour = result[0]
      this.callinspectionlabour = result[0];
      this.callinspectionlabour_amount = result[1];
        let RATE = 0;
        let CONTIGUOUS = 0;
      for(var i=0;i<this.callinspectionlabour.length;i++){
        this.wholetotal += this.callinspectionlabour[i].TOTAL;
        RATE += this.callinspectionlabour[i].RATE;
        CONTIGUOUS += this.callinspectionlabour[i].CONTIGUOUS;
        /*console.log(this.wholetotal);*/
      }
     this.final_data = RATE * CONTIGUOUS /100 + RATE;
     this.total_amount = this.callinspectionlabour_amount.TOTAL;
     this.total_profit = this.callinspectionlabour_amount.PROFIT;
      /*console.log('data1', this.callinspectionlabour);*/
      if(this.callinspectionlabour.length>0){
        this.presentLoadingDefault(false);
      }else{
        this.presentToast(`No data found`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(`Something Went Wrong`);
    });
    this.add_labour='block';
  
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

removedesignation(DESIGNATION_ID:any,DESIGNATION:any,LABOUR_COUNT:any,RATE:any,LABOUR_TIME:any,TOTAL:any,CALL_ESTIMATION_LABOUR_ID:any,CALL_ESTIMATION_DETAILS_ID:any,CALL_LOG_ID:any,CONTIGUOUS:any,COMPLAINT_ID:any){
  this.DESIGNATIONdata = DESIGNATION;
  this.LABOUR_COUNTdata = LABOUR_COUNT;
  this.RATEdata = RATE;
  this.LABOUR_TIMEdata = LABOUR_TIME;
  this.TOTALdata = TOTAL;
  this.CALL_ESTIMATION_LABOUR_IDdata = CALL_ESTIMATION_LABOUR_ID;
  this.CALL_ESTIMATION_DETAILS_IDdata = CALL_ESTIMATION_DETAILS_ID;
  this.CALL_LOG_IDdata = CALL_LOG_ID;
  this.COMPLAINT_IDdata = COMPLAINT_ID;
  this.DESIGNATION_IDdata = DESIGNATION_ID;
  if(CONTIGUOUS == 0){
    this.CONTIGUOUSvalue = 10;
  }else{
    this.CONTIGUOUSvalue = CONTIGUOUS;
  }
this.updatemodeldesignation = 'block';
}
updatedesignation(){
  this.presentLoadingDefault(true);
  let updatelabour = this.updatedesignationForm.value;
  updatelabour.modified_by= this.user.UserInfoId;
  updatelabour.COMPLAINT_ID= this.COMPLAINT_IDdata;
  updatelabour.CALL_ESTIMATION_ID = this.callinspectionlabour_amount.CALL_ESTIMATION_ID;
  updatelabour.DESIGNATION_ID= this.DESIGNATION_IDdata;
  this.authService.postData(updatelabour,'Call_inspection/Calllabourupdate/').then((result) => {
    this.view.dismiss();
    this.presentLoadingDefault(false);
    this.callinspectiondetailsdelete = result;
    this.getmaterialdata(this.callestimationdetails[0].Inspection[0].COMPLAINTCOUNT,this.callestimationdetails[0].Inspection[0].CALL_LOG_ID);
      this.presentLoadingDefault(false);
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast(`Something Went Wrong`);
  });
}

updatereson(REASION1:any,CALL_INSPECTION_DETAILS_ID:any){

  this.REASION1data = REASION1;
  this.CALL_INSPECTION_DETAILS_IDdata = CALL_INSPECTION_DETAILS_ID;
  this.updatemodelreason='block'; 
}
updatereason(){
  this.presentLoadingDefault(true);
  let updatereason = this.updatereasonForm.value;
  updatereason.modified_by= this.user.UserInfoId;
  this.authService.postData(updatereason,'Call_inspection/Callreasonupdate/').then((result) => {
    this.presentLoadingDefault(false);
    this.callinspectiondetailsdelete = result;
    this.getlabourdata(this.callestimationdetails[0].Inspection[0].COMPLAINTCOUNT,this.callestimationdetails[0].Inspection[0].CALL_LOG_ID);
      this.presentLoadingDefault(false);
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast(`Something Went Wrong`);
  });
}
updatematerial(M_SPECIFICATION:any,QUANTITY:any,RATE:any,CONTIGUOUS:any,CALL_ESTIMATION_ITEMS_ID:any){
this.M_SPECIFICATIONmaterial = M_SPECIFICATION;
this.QUANTITYmaterial = QUANTITY;
this.RATEmaterial = RATE;
if(CONTIGUOUS == 0){
  this.CONTIGUOUSvalue = 10;
}else{
  this.CONTIGUOUSvalue = CONTIGUOUS;
}

this.CALL_ESTIMATION_ITEMS_IDmaterial = CALL_ESTIMATION_ITEMS_ID;
this.updatematerialstyle = 'block';
}
updatematerialdata(){
  this.presentLoadingDefault(true);
  let updatematerialdetails = this.updatematerialForm.value;
  updatematerialdetails.modified_by= this.user.UserInfoId;
  this.authService.postData(updatematerialdetails,'Call_inspection/Callmaterialdetailsupdate/').then((result) => {
    this.presentLoadingDefault(false);
    this.updatematerialstyle = 'none';
    this.closeModal();
    this.callinspectiondetailsdelete = result;
    this.getlabourdata(this.callestimationdetails[0].Inspection[0].COMPLAINTCOUNT,this.callestimationdetails[0].Inspection[0].CALL_LOG_ID);
      this.presentLoadingDefault(false);
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast(`Something Went Wrong`);
  });
}
onCloseMaterialdetails(){
  this.updatematerialstyle = 'none';
}
openprofitmodel(holetotal_value:any){
  this.holetotaldata = holetotal_value;
  this.openprofitmodelstyle = 'block';
}
openprofitdata(){
  let openprofit = this.openprofitForm.value;
  openprofit.CALL_LOG_ID= this.callestimationdetails[0].Inspection[0].CALL_LOG_ID;
  openprofit.modified_by= this.user.UserInfoId;
  this.authService.postData(openprofit,'Call_inspection/openprofitupdate/').then((result) => {
    this.view.dismiss();
    this.presentLoadingDefault(false);
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast(`Something Went Wrong`);
  });
}
}