import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user.model';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the RealNameVerifiedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-real-name-verified',
  templateUrl: 'real-name-verified.html',
})

export class RealNameVerifiedPage {
  private user;
  model = new User('','','','','',null,null,'','',null,null,null,null, null,null,null);
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private userService:UserServiceProvider,
  private camera: Camera) {
    this.user = this.userService.getCurrentUser();
    this.model.verifyName = this.user.verifyName;
    this.model.idCard = this.user.idCard;
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad RealNameVerifiedPage');
  }
  submit(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
    this.user.verifyName = this.model.verifyName;
    this.user.idCard = this.model.idCard;
    this.userService.update(this.user).subscribe();
    
  }
  
}
