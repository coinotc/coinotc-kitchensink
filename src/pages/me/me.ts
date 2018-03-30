import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { AuthPage } from '../auth/auth';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { JwtServiceProvider } from '../../providers/jwt-service/jwt-service';
import { Errors } from '../../models/errors.model';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';
import { ComplainPage } from '../complain/complain';
import { AdvertisementsPage } from  '../advertisements/advertisements';
import { TrustedPage } from '../trusted/trusted';
/**
 * Generated class for the MePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-me',
  templateUrl: 'me.html'
})
export class MePage {
  private currentuser;
  placeholderPicture = 'http://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515005723652&di=a1ebb7c0a1b6bfede1ff5ebc057ed073&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3D822b27e7b8fb43160e12723948cd2c56%2F6c224f4a20a44623b6b1e24e9222720e0cf3d7a7.jpg';
  isSubmitting = false;
  enableNotifications = true;

  user = {
    name: 'Default user',
    email: '',
    imageUrl: 'assets/img/avatar/marty-avatar.png'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserServiceProvider,
    private jwtService: JwtServiceProvider,
    private toastCtrl: ToastController
  ) {
    this.currentuser = this.userService.getCurrentUser();
    console.log(this.user);
    console.log(navParams.data);

    this.user.name = this.currentuser.username;
    this.user.email = this.currentuser.email;
    this.user.imageUrl = this.placeholderPicture;

    // let initials:string = this.avatar.Avatar('initials', this.currentuser.username),
    // gravatar:string = this.avatar.Avatar('gravatar', this.currentuser.username, 'john@johndoe.com');

    //     document.getElementById('avatar-image').setAttribute('src', initials);
  }

  advertisementsTapped() {
    this.navCtrl.push(AdvertisementsPage);
  }
  trustedTapped() {
    this.navCtrl.push(TrustedPage);
  }
  settingsTapped() {
    this.navCtrl.push(SettingsPage);
  }
  updateProfileImage() {
    if (this.userService.getCurrentUser().username == '') {
      this.navCtrl.push(AuthPage);
    } else {
      this.navCtrl.push(
        ProfilePage,
        this.userService.getCurrentUser().username
      );
    }
  }
  complain() {
    this.navCtrl.push(ComplainPage);
  }
  logout() {
    //this.tabRef.select(3);
    this.isSubmitting = true;
    console.log(this.userService.logout());
    this.userService.logout().subscribe(
      user => {
        console.log('log out !!!!!');
        this.jwtService.destroyToken();
        
        let tabs = document.querySelectorAll('.tabbar.show-tabbar');
        console.log(JSON.stringify(tabs)+"<<<<<<<<<<<<");
        if (tabs !== null) {
          Object.keys(tabs).map(key => {
            tabs[key].style.display = 'none';
          });
        }
        this.navCtrl.setRoot(AuthPage); // end if
      },
      (errors: Errors) => {
        for (let field in errors.errors) {
          this.toastCtrl
            .create({
              message: `${field} ${errors.errors[field]}`,
              duration: 3000
            })
            .present();
        }
        this.isSubmitting = false;
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MePage');
  }
}
