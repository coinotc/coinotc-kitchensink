import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { AuthPage } from '../pages/auth/auth';
import * as firebase from 'firebase';
import { firebaseconfig }  from '../../environments/firebase-config'; 
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = AuthPage;

  constructor(
    private userService: UserServiceProvider,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private translate: TranslateService,
    private storage: Storage
  ) {
    this.storage.ready().then(() => this.storage.get('preferLanguage') as Promise<string>).then(value => {
      let langObj = JSON.parse(JSON.stringify(value));
      if(!langObj){
        translate.setDefaultLang(langObj.language);
      }else{
        translate.setDefaultLang('en');
      }
    });
    
    firebase.initializeApp(firebaseconfig);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
    this.userService.populate();
  }
}
