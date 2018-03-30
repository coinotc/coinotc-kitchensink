import { NgModule, ErrorHandler, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthPageModule } from '../pages/auth/auth.module';
import { WalletPage } from '../pages/wallet/wallet';
import { TradePage, PopoverPage } from '../pages/trade/trade';
import { AddadvertisementPage } from '../pages/addadvertisement/addadvertisement';
import { OrderListPage } from '../pages/order-list/order-list';
import { AlertPage, AddAlertPage } from '../pages/alert/alert';
import { RoomPageModule } from '../pages/room/room.module';
import { AdinformationPageModule } from '../pages/adinformation/adinformation.module';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OrderServiceProvider } from '../providers/order-service/order-service';
import { AdvertisementServiceProvider } from '../providers/advertisement-service/advertisement-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { JwtServiceProvider } from '../providers/jwt-service/jwt-service';
import { ProfileServiceProvider } from '../providers/profile-service/profile-service';
import { AvatarService } from 'ng-avatar';
import { ComplainServiceProvider } from '../providers/complain-service/complain-service';
import { CryptowalletProvider } from '../providers/cryptowallet/cryptowallet';
import { CurrenciesServiceProvider } from '../providers/currencies/currencies-service';
import { PaymentPrdPageModule } from '../pages/payment-prd/payment-prd.module';
import { FaIconComponent } from '../components/fa-icon/fa-icon.component';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';
import { MePageModule } from '../pages/me/me.module';
import { BindEmailPage } from '../pages/bind-email/bind-email';
import { BindPhonePage } from '../pages/bind-phone/bind-phone';
import { ModifyPrdPage } from '../pages/modify-prd/modify-prd';
import { RealNameVerifiedPage } from '../pages/real-name-verified/real-name-verified';
import { PincodeInputModule } from 'ionic2-pincode-input';
import { PincodePage } from '../pages/pincode/pincode';
import { ConfirmPincodePage } from '../pages/confirm-pincode/confirm-pincode';
import { ProfilePage } from '../pages/profile/profile';
import { ModifyTradepasswordPage } from '../pages/modify-tradepassword/modify-tradepassword';
import { SettingsPage } from '../pages/settings/settings';
import { ComplainInformationPage } from '../pages/complain-information/complain-information';
import { TwoFactorAuthPage } from '../pages/two-factor-auth/two-factor-auth';
import { SendMailServiceProvider } from '../providers/send-mail-service/send-mail-service';
import { Camera } from '@ionic-native/camera';
import { FCM } from '@ionic-native/fcm';
import { ComplainPage } from '../pages/complain/complain';
import { AdvertisementsPage } from '../pages/advertisements/advertisements';
import { TrustedPage } from '../pages/trusted/trusted';
import { ScrollingHeaderModule } from 'ionic-scrolling-header';
import { ElasticHeaderModule } from 'ionic2-elastic-header/dist'
import { Network } from '@ionic-native/network';
import { EditAdvertisementPage } from '../pages/edit-advertisement/edit-advertisement';
const rootRouting: ModuleWithProviders = RouterModule.forRoot([], {
  useHash: true
});

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/translate/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    WalletPage,
    TradePage,
    AddadvertisementPage,
    OrderListPage,
    AlertPage,
    AddAlertPage,
    FaIconComponent,
    BindEmailPage,
    BindPhonePage,
    ModifyPrdPage,
    RealNameVerifiedPage,
    PincodePage,
    ConfirmPincodePage,
    ProfilePage,
    ModifyTradepasswordPage,
    SettingsPage,
    ComplainInformationPage,
    ComplainPage,
    AdvertisementsPage,
    TrustedPage,
    PopoverPage,
    EditAdvertisementPage,
    TwoFactorAuthPage
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, { mode: 'md' }),
    HttpClientModule,
    HttpModule,
    rootRouting,
    AuthPageModule,
    PincodeInputModule,
    MePageModule,
    RoomPageModule,
    PaymentPrdPageModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    AdinformationPageModule,
    ElasticHeaderModule,
    ScrollingHeaderModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    WalletPage,
    TradePage,
    AddadvertisementPage,
    OrderListPage,
    AlertPage,
    AddAlertPage,
    BindEmailPage,
    BindPhonePage,
    ModifyPrdPage,
    RealNameVerifiedPage,
    PincodePage,
    ConfirmPincodePage,
    ProfilePage,
    ModifyTradepasswordPage,
    SettingsPage,
    ComplainInformationPage,
    ComplainPage,
    AdvertisementsPage,
    TrustedPage,
    PopoverPage,
    EditAdvertisementPage,
    TwoFactorAuthPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    OrderServiceProvider,
    AdvertisementServiceProvider,
    UserServiceProvider,
    ApiServiceProvider,
    JwtServiceProvider,
    HttpModule,
    HttpClientModule,
    IonicStorageModule,
    ProfileServiceProvider,
    AvatarService,
    ComplainServiceProvider,
    CryptowalletProvider,
    CurrenciesServiceProvider,
    AlertServiceProvider,
    SendMailServiceProvider,
    Camera,
    FCM,
    Network
  ]
})
export class AppModule { }
