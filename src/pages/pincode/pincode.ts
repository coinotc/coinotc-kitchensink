import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PincodeController } from 'ionic2-pincode-input/dist/pincode'
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
  private user;
  private deviceToken;
  code: Number;
  private status;
  constructor(
    public navCtrl: NavController,
    public pincodeCtrl: PincodeController,
    public navParams: NavParams
  ) {//change tradePrd
    this.type = this.navParams.data.type;
    this.user = this.navParams.data.user;
    this.deviceToken = this.navParams.data.deviceToken;
    console.log(this.type);
    if (this.type)
      this.status = false;
    else
      this.status = true;
    let pinCode = this.pincodeCtrl.create({
      title: 'Pincode',
      hideForgotPassword: true,
      hideCancelButton:this.status,
      enableBackdropDismiss: false
    });
    pinCode.present();
    pinCode.onDidDismiss((code, status) => {
      this.code = code;
      if (this.type) {
        if (status === 'cancel') {
          this.navCtrl.setRoot(MePage)
        } else {
          this.navCtrl.setRoot(ConfirmPincodePage, { code: this.code, type: this.type });
        }
      } else {
        this.navCtrl.setRoot(ConfirmPincodePage, { code: this.code, user: this.user, deviceToken: this.deviceToken });
      }
    })
  }
}
