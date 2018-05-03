import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { complain } from '../../models/complain';
import { ComplainServiceProvider } from '../../providers/complain-service/complain-service'
import { RoomPage } from '../room/room';
import { CustomerSupportPage } from '../customer-support/customer-support';
/**
 * Generated class for the ComplainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complain',
  templateUrl: 'complain.html',
})
export class ComplainPage {
  private user;
  private complains:complain[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private userServiceProvider: UserServiceProvider,
  private complainService:ComplainServiceProvider) {
    this.user = this.userServiceProvider.getCurrentUser();
    if(this.user.username){
      this.complainService.getComplains(this.user.username).subscribe((result) => {
        this.complains = result;
      });
    }
  }
  onDetail(complain) {
    this.navCtrl.push(CustomerSupportPage, { complain:complain });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplainPage');
  }

}

// mmap