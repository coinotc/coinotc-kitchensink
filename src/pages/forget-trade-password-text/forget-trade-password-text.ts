import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ConfirmTradePasswordCodePage } from '../confirm-trade-password-code/confirm-trade-password-code';
/**
 * Generated class for the ForgetTradePasswordTextPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget-trade-password-text',
  templateUrl: 'forget-trade-password-text.html',
})
export class ForgetTradePasswordTextPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public userService:UserServiceProvider) {
  }
  confirmToSendEmail(){
    this.userService.forgetTradePassword(this.userService.getCurrentUser().email).subscribe(result=>{
      this.navCtrl.setRoot(ConfirmTradePasswordCodePage);
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetTradePasswordTextPage');
  }

}
