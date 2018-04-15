import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  LoadingController,
  App
} from 'ionic-angular';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Errors } from '../../models/errors.model';
import { TabsPage } from '../../pages/tabs/tabs';
import { PincodePage } from '../pincode/pincode'
import { FCM, NotificationData } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Generated class for the AuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html'
})
export class AuthPage {
  authType: 'register' | 'login' = 'login';
  isSubmitting = false;
  authForm: FormGroup;
  deviceToken;
  isModal: boolean; // show close button only in a modal
  networkStatusIndicator: Number = 0;
  password = 'password';
  
  onlineToast: any;
  offlineToast: any;
  private PASSWORD_PATTERN = '^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{12,}$';

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private userService: UserServiceProvider,
    private params: NavParams,
    private fb: FormBuilder,
    private fcm: FCM,
    private platform: Platform,
    private network: Network,
    private loadingCtrl: LoadingController,
    public appCtrl:App
  ) {
    // use FormBuilder to create a form group
    //
    this.authForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, this.emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(this.PASSWORD_PATTERN)])]
    });
    this.isModal = !!params.get('isModal');
    this.platform.ready().then(() => {
            this.fcm
              .getToken()
              .then((token: string) => {
                console.log('The token to use is: ', token);
                this.deviceToken = token;
              })
              .catch(error => {
                console.error(error);
              });
            this.fcm.onTokenRefresh().subscribe(token => {
              console.log(token);
              this.deviceToken = token;
             });
            this.fcm.onNotification().subscribe(
              (data: NotificationData) => {
                if (data.wasTapped) {
                  console.log('Received in background', JSON.stringify(data));
                } else {
                  console.log('Received in foreground', JSON.stringify(data));
                }
              },
              error => {
                console.error('Error in notification', error);
              }
            );
          });
  }
  authTypeChange() {
    if (this.authType === 'register') {
      this.authForm.addControl('username', new FormControl());
    } else {
      this.authForm.removeControl('username');
    }
    if(this.authType === 'login'){
      this.authForm = this.fb.group({
        email: ['', Validators.compose([Validators.required, this.emailValidator])],
        password: ['', Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]
      });
    }else{
      let passwordControl = new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]));
      let confirmPasswordControl = new FormControl('', Validators.compose([Validators.required, this.equalTo(passwordControl)]));
      this.authForm = this.fb.group({
        username :['',Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(18)])],
        email: ['', Validators.compose([Validators.required, this.emailValidator])],
        password: passwordControl,
        confirmPassword: confirmPasswordControl
      });
    }
  }

  emailValidator = (control: FormControl): { [s: string]: boolean } => {
    const EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!control.value) {
      return { required: true }
    } else if (!EMAIL_REGEXP.test(control.value)) {
      return {  email: true ,required : false};
    }
  };

  equalTo(equalControl: AbstractControl): ValidatorFn {
    let subscribe = false;
    return (control: AbstractControl): ValidationErrors | null => {
      if (!subscribe) {
        subscribe = true;
        equalControl.valueChanges.subscribe(() => {
          control.updateValueAndValidity();
        });
      }
      let input = control.value;
      console.log(input);
      console.log("equalControl.value" + equalControl.value);
      let isValid=control.root.value[equalControl.value]==input;
      console.log('isValid> ' + isValid);
      if(!isValid){
        console.log('>>>>');
        return { isValid: true, required : false }
      }else{
        return null;
      }
    };
  }
  
  submitForm() {
    let loading = this.loadingCtrl.create({
        spinner: 'circles',
        content: 'loading...',
        duration: 3000

    });
    loading.present();
    console.log(this.deviceToken);
    this.isSubmitting = true;
    const credentials = this.authForm.value;
    this.userService
      .attemptAuth(this.authType, credentials, this.deviceToken)
      .subscribe(
        user => {
          console.log("subscribe user!!!");
          if (this.isModal) this.viewCtrl.dismiss();
          this.displayTabs();
          if (this.authType === 'register') {
            this.appCtrl.getRootNav().setRoot(PincodePage);
          } else {
            console.log("Login ...." + this.navCtrl.parent);
            loading.dismiss().then(()=>{
              // if(this.navCtrl.parent != null){
              //   console.log(">>>>"+ this.navCtrl.parent)
              //   this.navCtrl.parent.previousTab(false)
              //   this.navCtrl.parent.select(0);
              // }
              this.appCtrl.getRootNav().setRoot(TabsPage);
              loading = null;
            }).catch(e=> console.log(e));
          }
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

  private displayTabs() {
    let tabs = document.querySelectorAll('.tabbar.show-tabbar');

    if (tabs !== null) {
      Object.keys(tabs).map(key => {
        tabs[key].style.display = 'flex';
      });
    } // end if
  }

  close() {
    this.viewCtrl.dismiss();
  }

  displayOnlineNetworkUpdate(connectionState: string){
    let networkType = this.network.type;
    this.networkStatusIndicator = 2;
    //this.offlineToast.dismiss();
    this.onlineToast = this.toastCtrl
        .create({
          message: `You are now ${connectionState} via ${networkType}`,
          duration: 3000
        }).present();
  }

  displayOfflineNetworkUpdate(connectionState: string){
    this.networkStatusIndicator = 1;
    //this.onlineToast.dismiss();
    this.offlineToast = this.toastCtrl
        .create({
          message: `You are now offline`,
          showCloseButton: true
        }).present();
  }

  ionViewDidEnter() {
    this.network.onConnect().subscribe(data => {
      console.log(data);
      if(this.networkStatusIndicator != 2){
        this.displayOnlineNetworkUpdate(data.type);
      }
    }, error => console.error(error));
   
    this.network.onDisconnect().subscribe(data => {
      console.log(data);
      if(this.networkStatusIndicator != 1){
        this.displayOfflineNetworkUpdate(data.type);
      }
    }, error => console.error(error));
  }
}