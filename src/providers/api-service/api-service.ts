import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


import { JwtServiceProvider } from '../jwt-service/jwt-service';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {
  private API_URL = 'http://192.168.2.114:3000/api';


  constructor(
    private http: Http,
    private jwtService: JwtServiceProvider) {
    console.log('Hello ApiServiceProvider Provider');
  }

  private setHeaders(): Headers{
    let headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    if(this.jwtService.latestToken){
      headersConfig['Authorization'] = `Token ${this.jwtService.latestToken}`;
    }
    return new Headers(headersConfig);
  }

  private formatErrors(error:any){
    return Observable.throw(error.json());
  }

  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
    return this.http.get(`${this.API_URL}${path}`, { headers: this.setHeaders(), search: params })
    .catch(this.formatErrors)
    .map((res:Response) => res.json());
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(`${this.API_URL}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors)
    .map((res:Response) => res.json());
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${this.API_URL}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors)
    .map((res:Response) => res.json());
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${this.API_URL}${path}`,
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors)
    .map((res:Response) => res.json());
  }
}
