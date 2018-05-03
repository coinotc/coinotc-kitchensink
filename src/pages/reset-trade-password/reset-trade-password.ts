import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, App } from 'ionic-angular';
import { PincodeController } from 'ionic2-pincode-input/dist/pincode';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { TabsPage } from '../tabs/tabs';
import { ConfirmResetTradePasswordPage } from '../confirm-reset-trade-password/confirm-reset-trade-password';
/**
 * Generated class for the ResetTradePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-trade-password',
  templateUrl: 'reset-trade-password.html',
})
export class ResetTradePasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public pincodeCtrl: PincodeController,
    public userService: UserServiceProvider,
    private toastCtrl: ToastController) {
      let pinCode = this.pincodeCtrl.create({
        title: 'Pincode',
        hideForgotPassword: true,
        hideCancelButton: false,
        enableBackdropDismiss: false
      });
      pinCode.present();
      pinCode.onDidDismiss((code, status) => {
          if (status === 'cancel') {
            this.navCtrl.setRoot(TabsPage);
          } else {
            this.navCtrl.setRoot(ConfirmResetTradePasswordPage, { code: code });
          } 
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetTradePasswordPage');
  }

}
