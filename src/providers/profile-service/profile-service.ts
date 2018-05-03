import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../../models/profile.model';
import { environment } from '../../../environments/environment';
import { UserServiceProvider } from '../user-service/user-service';
import { ApiServiceProvider } from '../api-service/api-service';
import { Observable } from 'rxjs/Rx';
/*
  Generated class for the ProfileServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class ProfileServiceProvider {
  currentUserName = this.userService.getCurrentUser().username;
  private profileURL = '/users/public';

  constructor(
    public apiService: ApiServiceProvider,
    private userService: UserServiceProvider
  ) {
    console.log('Hello ProfileServiceProvider Provider');
  }

  public getProfile(username): Observable<Profile> {
    let URL = `${this.profileURL}?username=${username}`;
    return this.apiService.get(URL);
  }
  public sendFollowing(username, following) {
    let URL = `${this.profileURL}/follow?username=${username}`;
    return this.apiService.patch(URL, following);
  }
  public sendFollowers(username, followers) {
    let URL = `${this.profileURL}/followers?username=${username}`;
    return this.apiService.patch(URL, followers);
  }
  public settradepassword(username, tradepassword) {
    let URL = `${this.profileURL}/tradepassword`;
    return this.apiService.patch(URL, { tradePrd: tradepassword ,username:username});
  }
  public sendRating(username, ratings) {
    let URL = `${this.profileURL}/ratings?username=${username}`;
    return this.apiService.patch(URL, ratings);
  }
  public updateDeviceToken(username, deviceToken) {
    let URL = `${this.profileURL}/deviceToken?username=${username}`;
    return this.apiService.patch(URL, { deviceToken: deviceToken });
  }
}
