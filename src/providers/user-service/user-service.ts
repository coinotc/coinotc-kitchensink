import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiServiceProvider } from '../api-service/api-service';
import { JwtServiceProvider } from '../jwt-service/jwt-service';
import { User } from '../../models/user.model';
import { Storage } from '@ionic/storage';
import { environment } from '../../../environments/environment';

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserServiceProvider {
  private currentUserSubject = new BehaviorSubject<User>(new User('','','','','',null,null,'','',null,null,null,null, null,null,null));
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiServiceProvider,
    private jwtService: JwtServiceProvider,
    private storage: Storage,
    public http: HttpClient, ) {
    console.log('UserServiceProvider Provider');
  }

  populate() {
    // If JWT detected, attempt to get & store user's info
    this.jwtService.getToken().then(token => {
      if (token) {
        this.apiService.get('/user')
          .subscribe(
            data => this.setAuth(data.user),
            err => this.purgeAuth()
          );
      } else {
        // Remove any potential remnants of previous auth states
        this.purgeAuth();
      }
    });
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token).then(() => {
      // Set current user data into observable
      this.currentUserSubject.next(user);
      console.log(user);
      console.log(">>> " + user.nativeCurrency);
      let nativeCurry = {
        currency: user.nativeCurrency
      }
      this.storage.ready().then(() => this.storage.set('nativeCurrency', nativeCurry) as Promise<void>)

      // Set isAuthenticated to true
      this.isAuthenticatedSubject.next(true);
    });
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken().then(() => {
      // Set current user to an empty object
      this.currentUserSubject.next(new User('','','','','',null,null,'','',null,null,null,null,null,null,null));
      // Set auth status to false
      this.isAuthenticatedSubject.next(false);
    });
  }

  attemptAuth(type, credentials, deviceToken): Observable<User> {
    let route = (type === 'login') ? '/login' : '';
    return this.apiService.post('/users' + route, { user: credentials, deviceToken: deviceToken })
      .map(data => {
        this.setAuth(data.user);
        return data;
      })

  }

  public logout(): Observable<User> {
    return this.apiService.get('/users/logout')
      .map(data => {
        this.purgeAuth();
        return data;
      });
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    // Check if the user is authenticated
    return this.isAuthenticatedSubject.getValue();
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    console.log(user.token);
    return this.apiService.put('/user', { user }).map(data => {
      console.log('return running');
      // Update the currentUser observable
      this.currentUserSubject.next(data.user);
      return data.user;
    });
  }

  // Update the user on the server (email, pass, etc)
  updateBaseCurrency(currency): Observable<User> {
    return this.apiService.put('/users/base-currency', currency).map(data => {
      this.storage.ready().then(() => this.storage.set('nativeCurrency', currency) as Promise<void>)
      return data;
    });
  }
  public getTradepassword(username) {
    let tradePrdURL = environment.api_url + '/users/tradepassword';
    let URL = `${tradePrdURL}?username=${username}`;
    return this.http.get<User>(URL, httpOptions);
  }
  public get2faSecret(username) {
    return this.http.get(`/2fa?username=${username}`, httpOptions);
  }
}
