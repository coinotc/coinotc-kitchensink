import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PincodeController } from  'ionic2-pincode-input/dist/pincode'
import { ConfirmPincodePage } from '../confirm-pincode/confirm-pincode'
import { MePage } from '../me/me';
/**
 * Generated class for the PincodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pincode',
  templateUrl: 'pincode.html',
})
export class PincodePage {
  private type;
  code:Number;
    constructor(
      public navCtrl: NavController,
      public pincodeCtrl: PincodeController,
      public navParams:NavParams
    ) {//change tradePrd
        this.type = this.navParams.data.type;
        console.log(this.type)
          let pinCode =  this.pincodeCtrl.create({
            title:'Pincode',
            hideForgotPassword:true,
            hideCancelButton:true,
            enableBackdropDismiss:false
          });
          pinCode.present();
          pinCode.onDidDismiss( (code,status) => 
            {
              this.code = code;
              if(this.type){
                if(status === 'cancel'){
                  this.navCtrl.setRoot(MePage)
                }else{
                  this.navCtrl.setRoot(ConfirmPincodePage,{code:this.code,type:this.type});
                }
              }else{
                this.navCtrl.setRoot(ConfirmPincodePage,{code:this.code});
              }
          })
          

  }
}
