import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
/**
 * Generated class for the SendMailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-mail',
  templateUrl: 'send-mail.html',
})
export class SendMailPage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public userService:UserServiceProvider,
) {
  }
  sendMail(){
    // console.log(this.userService.getCurrentUser())
    // this.userService.changeRandonString(this.userService.getCurrentUser().username).subscribe(result=>{
    //   console.log(result.secretToken)
    //   console.log(result.email)
    //   this.sendMailService.sendMail(result.email,result.secretToken).subscribe();
    // })
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SendMailPage');
  }

}
