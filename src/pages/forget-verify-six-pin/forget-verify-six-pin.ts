import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, App } from 'ionic-angular';
import { PincodeController } from 'ionic2-pincode-input/dist/pincode';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthPage } from '../auth/auth';
import { SetNewPasswordPage } from '../set-new-password/set-new-password';
/**
 * Generated class for the ForgetVerifySixPinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget-verify-six-pin',
  templateUrl: 'forget-verify-six-pin.html',
})
export class ForgetVerifySixPinPage {
  private pinCode;
  private email;
  private sixCode: number;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public pincodeCtrl: PincodeController,
    public userService: UserServiceProvider,
    private toastCtrl: ToastController
  ) {
    this.email = this.navParams.data.email
    console.log(this.email)
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
        this.navCtrl.setRoot(AuthPage)
      else {
        this.sixCode = parseInt(`${code}`);

        console.log(this.sixCode)
        console.log(code)
        console.log(typeof (this.sixCode))
        console.log(typeof (code))
        this.userService.forgetVerifySixPin(this.email, this.sixCode).subscribe(result => {
          console.log(result)
          this.toastCtrl
            .create({
              message: `${result}`,
              duration: 4500
            })
            .present();
          if (result == "success")
            this.navCtrl.setRoot(SetNewPasswordPage, { email: this.email })
          else this.navCtrl.setRoot(ForgetVerifySixPinPage, { email: this.email })
        })
      }
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetVerifySixPinPage');
  }

}
