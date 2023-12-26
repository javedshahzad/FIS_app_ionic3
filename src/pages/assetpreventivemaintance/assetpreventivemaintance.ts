import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-assetpreventivemaintance',
  templateUrl: 'assetpreventivemaintance.html',
})

export class AssetpreventivemaintancePage {
  preventiveMaintanceTab: any;
  assetDetailsPrevMaintance = {} as any;
  subAssetForm: FormGroup
  subImageURI: any;
  subImageFileName: any;
  serviceImageURI: any;
  serviceImageFileName: any;
  loading = this.loadingCtrl.create({ content: ``, spinner: 'default' });
  isSubMessageShow = false;
  isServiceMessageShow = false;
  isImageMessageShow = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: RestProvider, private formBuilder: FormBuilder,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, private transfer: FileTransfer,
    public view: ViewController) {
    this.preventiveMaintanceTab = "asset";
    this.subAssetForm = this.formBuilder.group({
      item: ['', Validators.compose([Validators.required])],
      specification: ['', Validators.compose([Validators.required])],
      subFile: ['', Validators.compose([Validators.required])],
      quantity: ['', Validators.compose([Validators.required])],
      comments: ['', Validators.compose([Validators.required])]
    });
  }

  getImage(row_no) {
    let objFile = this.assetDetailsPrevMaintance.AssetDetailFiles.find(o => o.ROW_NO === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_type = objFile.FILE_TYPE;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    if (file_type == 'IMAGE') {
      return `data:image/${extn};base64,${this.encode(bytes)}`;
    } else {
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

  presentLoadingDefault(show) {
    if (show)
      this.loading.present();
    else
      this.loading.dismiss();
  };

  ngOnInit() {

    debugger;
    this.assetDetailsPrevMaintance = this.navParams.get('assetDetail');
    if (!this.assetDetailsPrevMaintance)
      //this.navCtrl.pop();
      this.closeModal();
    if (this.assetDetailsPrevMaintance.ServiceAssetDetail.length == 0) {
      this.isSubMessageShow = true;
    }
    if (this.assetDetailsPrevMaintance.ServiceAssetDetail.length == 0) {
      this.isServiceMessageShow = true;
    }
    if (this.assetDetailsPrevMaintance.AssetDetailFiles.length == 0) {
      this.isImageMessageShow = true;
    }
    // this.assetDetailsLoad(this.assetDetailsPrevMaintance);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.setRoot(SearchPage);
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }

    fileTransfer.upload(this.subImageURI, '', options)
      .then((data) => {
        // console.log(data+" Uploaded Successfully");
        loader.dismiss();
        this.presentToast("Image uploaded successfully");
      }, (err) => {
        /* console.log(err);*/
        loader.dismiss();
        this.presentToast(err);
      });
  }
  
  closeModal() {
    this.view.dismiss();
  }

  validSubAsset() {
    /* console.log("Sub Asset Uploaded Successfully");*/
  }
}
