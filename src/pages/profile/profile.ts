import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { Observable } from 'rxjs/Observable';
import { Profile } from '../../models/profile.model';
import { AdvertisementServiceProvider } from '../../providers/advertisement-service/advertisement-service';
import { advertisement} from '../../models/advertisement'
import { RoomPage } from '../room/room';
import { AdinformationPage } from '../adinformation/adinformation';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  value = "ad";
  placeholderPicture = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515005723652&di=a1ebb7c0a1b6bfede1ff5ebc057ed073&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3D822b27e7b8fb43160e12723948cd2c56%2F6c224f4a20a44623b6b1e24e9222720e0cf3d7a7.jpg';
  private profile: Observable<Profile>;
  model = new Profile(null, null, '');
  rate;
  profileUser;
  currentUserName;
  blockStatus;
  followStatus;
  private ad:advertisement[];
  private trade:advertisement[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserServiceProvider,
    private profileService: ProfileServiceProvider,
    private ev: Events,
    private advertisementService:AdvertisementServiceProvider
  ) {
    this.ev.subscribe('hello', function() {
      this.blockStatus = this.userService
        .getCurrentUser()
        .block.indexOf(this.profileUser);
      if (this.blockStatus < 0) {
        this.blockStatus = 'block';
      } else {
        this.blockStatus = 'unblock';
      }
    });
    this.profileUser = navParams.data;
    this.currentUserName = this.userService.getCurrentUser().username;
    this.blockStatus = this.userService
      .getCurrentUser()
      .block.indexOf(this.profileUser);
    if (this.blockStatus < 0) {
      this.blockStatus = 'block';
    } else {
      this.blockStatus = 'unblock';
    }
    this.followStatus = this.userService
      .getCurrentUser()
      .following.indexOf(this.profileUser);
    if (this.followStatus < 0) {
      this.followStatus = 'follow';
    } else {
      this.followStatus = 'unfollow';
    }
    this.profile = this.profileService.getProfile(this.profileUser);
    this.profile.subscribe(result => {
      this.model = result[0];
      if (this.model.orderCount == 0) {
        this.rate = 0;
      } else {
        this.rate = this.model.goodCount / this.model.orderCount;
      }
    });
    this.onSegment();
  }
  onDetail(order, trader) {
    this.navCtrl.push(RoomPage, { order:order, trader:trader , type:"order"});
  }
  adinformation(information) {
    if(information.type == 1){
    this.navCtrl.push(AdinformationPage, { information: information, tradetype: { type: 'Buy', crypto: information.crypto } })
    }else{
    this.navCtrl.push(AdinformationPage, { information: information, tradetype: { type: 'Sell', crypto: information.crypto } })
    }
  }
  block() {
    let b = this.userService.getCurrentUser().block;
    if (this.blockStatus == 'block') {
      b.push(this.profileUser);
    } else {
      b.splice(
        this.userService.getCurrentUser().block.indexOf(this.profileUser),
        1
      );
    }
    this.profileService.sendBlock(this.currentUserName, b).subscribe();
    this.navCtrl.push(ProfilePage,
      this.profileUser)
  }
  follow() {
    let a = this.userService.getCurrentUser().followers;
    let b = this.userService.getCurrentUser().following;
    if (this.followStatus == 'follow') {
      b.push(this.profileUser);
      a.push(this.currentUserName)
    } else {
      b.splice(
        this.userService.getCurrentUser().following.indexOf(this.profileUser),
        1
      );
      a.splice(
        this.userService.getCurrentUser().following.indexOf(this.currentUserName),
        1
      );
    }
    this.profileService.sendFollowing(this.currentUserName, b).subscribe();
    this.profileService.sendFollowers(this.profileUser, a).subscribe();
    this.navCtrl.push(ProfilePage,
      this.profileUser)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  onSegment() {
    switch (this.value) {
      case 'ad':
        this.advertisementService.getMyadvertisement(this.profileUser,true).subscribe((result) => {
          this.ad = result;
          
        }); break;
      case 'trade':
        this.advertisementService.getMyadvertisement(this.profileUser,true).subscribe(result => {
          this.trade = result;
         
        }); break;
    }
  } 
}
