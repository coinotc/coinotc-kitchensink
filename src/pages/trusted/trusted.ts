import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the TrustedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trusted',
  templateUrl: 'trusted.html',
})
export class TrustedPage {
  value = "following";
  private user;
  private followings;
  private followers;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userServiceProvider: UserServiceProvider,
    private profileService:ProfileServiceProvider) {
      this.user = this.userServiceProvider.getCurrentUser();
      this.onSegment()
  }
  profile(username) {
    this.navCtrl.push(ProfilePage, username);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TrustedPage');
  }
  onSegment() {
    switch (this.value) {
      case 'following':
        this.profileService.getProfile(this.user.username).subscribe((result) => {
          console.log(result[0].following)
          this.followings = result[0].following;
          
        }); break;
      case 'followers':
      this.profileService.getProfile(this.user.username).subscribe((result) => {
        console.log(result[0].followers)
        this.followers = result[0].followers;
        }); break;
    }
  }

}
