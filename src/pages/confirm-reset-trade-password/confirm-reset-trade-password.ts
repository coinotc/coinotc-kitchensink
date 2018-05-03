import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController, Tabs } from 'ionic-angular';
import { PincodeController } from  'ionic2-pincode-input/dist/pincode';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { TabsPage } from '../tabs/tabs';
import { ResetTradePasswordPage } from '../reset-trade-password/reset-trade-password';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
/**
 * Generated class for the ConfirmResetTradePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-reset-trade-password',
  templateUrl: 'confirm-reset-trade-password.html',
})
export class ConfirmResetTradePasswordPage {
  comfirmcode:Number;
  password:Number;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public pincodeCtrl: PincodeController,    
    private userService: UserServiceProvider,
    private profileService: ProfileServiceProvider,
    private toastCtrl: ToastController) {
      this.password = navParams.data.code;
      let pinCode =  this.pincodeCtrl.create({
        title:'Pincode',
        hideForgotPassword:true,
        hideCancelButton:false,
        enableBackdropDismiss:false
      });
      pinCode.present();
      pinCode.onDidDismiss( (code,status) => 
        {
          if(status == 'cancel'){
              this.navCtrl.setRoot(TabsPage)
          }else{
          this.comfirmcode = code;
          if(this.password == this.comfirmcode){
            this.password = JSON.parse(JSON.stringify(this.password))
              this.profileService.settradepassword(this.userService.getCurrentUser().username,this.password).
              subscribe(result=>{
                this.toastCtrl
               .create({
                 message: `TradePassword have been reset`,
                 duration: 3000
               })
               .present();
               this.navCtrl.setRoot(TabsPage);
              })
          }else{
            let toast = this.toastCtrl.create({
              message: 'Wrong type',
              duration: 3000,
            });
            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });
            toast.present();
            this.navCtrl.setRoot(ResetTradePasswordPage);
          }
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmResetTradePasswordPage');
  }

}
