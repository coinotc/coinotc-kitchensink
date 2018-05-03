import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, App } from 'ionic-angular';
import { PincodeController } from 'ionic2-pincode-input/dist/pincode';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ResetTradePasswordPage } from '../reset-trade-password/reset-trade-password';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the ConfirmTradePasswordCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-trade-password-code',
  templateUrl: 'confirm-trade-password-code.html',
})
export class ConfirmTradePasswordCodePage {
  private pinCode;
  private email;
  private sixCode: number;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public pincodeCtrl: PincodeController,
    public userService: UserServiceProvider,
    private toastCtrl: ToastController) {
      this.email = this.userService.getCurrentUser().email;
      this.pinCode = this.pincodeCtrl.create({
        title: 'Pincode',
        hideForgotPassword: true,
        enableBackdropDismiss: false,
        hideCancelButton: false,
        cancelButtonText: "cancel"
      });
      this.pinCode.present();
      this.pinCode.onDidDismiss((code, status) => {
        if (status == "cancel")
          this.navCtrl.setRoot(TabsPage);
        else {
          this.sixCode = parseInt(`${code}`);
          console.log(this.sixCode)
          console.log(code)
          console.log(typeof (this.sixCode))
          console.log(typeof (code))
          this.userService.confirmTradePasswordCode(this.email, this.sixCode).subscribe(result => {
            console.log(result)
            this.toastCtrl
              .create({
                message: `${result}`,
                duration: 4500
              })
              .present();
            if (result == "success")
              this.navCtrl.setRoot(ResetTradePasswordPage);
            else this.navCtrl.setRoot(ConfirmTradePasswordCodePage);
          })
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmTradePasswordCodePage');
  }

}
