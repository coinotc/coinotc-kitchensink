import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user.model';

/**
 * Generated class for the BindPhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bind-phone',
  templateUrl: 'bind-phone.html',
})
export class BindPhonePage {
  private user;
  model = new User('','','','','',null,null,'','',null,null,null,null, null,null,null);
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userService:UserServiceProvider) {
      this.user = this.userService.getCurrentUser();
      this.model.phone = this.user.phone;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BindPhonePage');
  }
  submit(){
    this.user.phone = this.model.phone;
    this.userService.update(this.user).subscribe();
  }
}
