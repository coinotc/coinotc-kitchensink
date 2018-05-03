import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { PincodeController } from 'ionic2-pincode-input/dist/pincode';
import { TabsPage } from '../tabs/tabs';
import { PincodePage } from '../pincode/pincode';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { MePage } from '../me/me';
import { AuthPage } from '../auth/auth';
/**
 * Generated class for the ConfirmPincodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-pincode',
  templateUrl: 'confirm-pincode.html',
})
export class ConfirmPincodePage {
  //currentUserName;
  comfirmcode: Number;
  password: Number;
  private type;
  private user;
  private deviceToken;
  private status;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public pincodeCtrl: PincodeController,
    private userService: UserServiceProvider,
    private profileService: ProfileServiceProvider,
    private toastCtrl: ToastController
  ) {
    this.type = this.navParams.data.type;
    this.user = this.navParams.data.user;
    this.deviceToken = this.navParams.data.deviceToken;
    console.log(this.type)
    if (this.type)
      this.status = false;
    else
      this.status = true;
    //this.currentUserName = this.userService.getCurrentUser().username
    this.password = navParams.data.code
    let pinCode = this.pincodeCtrl.create({
      title: 'Pincode',
      hideForgotPassword: true,
      hideCancelButton: this.status,
      enableBackdropDismiss: false
    });
    pinCode.present();
    pinCode.onDidDismiss((code, status) => {
      if (this.type && status == 'cancel') {
        this.navCtrl.setRoot(TabsPage)
      } else {
        this.comfirmcode = code;
        if (this.password == this.comfirmcode) {
          this.password = JSON.parse(JSON.stringify(this.password))
          if (this.type) {
            console.log(this.comfirmcode)
            console.log(this.type)
            this.profileService.settradepassword(this.userService.getCurrentUser().username, this.password).
              subscribe(result => {
                this.toastCtrl
                  .create({
                    message: `TradePassword have been changed`,
                    duration: 3000
                  })
                  .present();
                this.navCtrl.setRoot(TabsPage);
              })
          } else {
            this.userService.signUp(this.user, this.deviceToken, this.password).subscribe(user => {
              console.log(user)
            })
            this.toastCtrl
              .create({
                message: `Account successfully created. \n Kindly check email for confirmation.`,
                duration: 4500
              })
              .present();
            this.navCtrl.setRoot(AuthPage);
          }
        } else {
          let toast = this.toastCtrl.create({
            message: 'Wrong type',
            duration: 3000,
          });
          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
          toast.present();
          if (this.type) {
            this.navCtrl.setRoot(PincodePage, { type: this.type });
          } else {
            this.navCtrl.setRoot(PincodePage , {user: this.user, deviceToken: this.deviceToken });
          }
        }
      }
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmPincodePage');
  }

}
