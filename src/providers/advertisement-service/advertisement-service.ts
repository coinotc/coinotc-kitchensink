import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { advertisement } from '../../models/advertisement';

/*
  Generated class for the AdvertisementServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class AdvertisementServiceProvider {
  // private countrySource = new Subject<string>(); private fiatSource = new Subject<string>();
  // country$ = this.countrySource.asObservable(); fiat$ = this.fiatSource.asObservable();
  private advertisement = environment.api_url + '/advertisement';
  constructor(public http: HttpClient) {
    console.log('Hello AdvertisementServiceProvider Provider');
  }
  // public getadbuy(crypto){
  //   let url = `${this.adbuy}?crypto=${crypto}`
  //   console.log(url);
  //   return this.http.get<adinformation[]>(url, httpOptions);
  // }
  public getadvertisement(crypto, country,fiat, type) {
    let url = `${this.advertisement}?crypto=${crypto}&type=${type}&country=${country}&fiat=${fiat}`;
    return this.http.get<advertisement[]>(url, httpOptions);
  }
  // public addadbuy(information){
  //   return this.http.post(this.adbuy, information, httpOptions);
  // }
  public addadvertisement(information) {
    return this.http.post(this.advertisement, information, httpOptions);
  }
  // public getadsell(crypto){
  //   let url = `${this.adsell}?crypto=${crypto}`
  //   console.log(url);
  //   return this.http.get<adinformation[]>(url, httpOptions);
  // }
  // public addadsell(information){
  //   return this.http.post(this.adsell, information, httpOptions);
  // }
  public getMyadvertisement(username, type) {
    let URL =
      this.advertisement + `/myadvertisement?owner=${username}&visible=${type}`;
    return this.http.get<advertisement[]>(URL, httpOptions);
  }
  public getMyEditAdvertisement(id) {
    let URL =
      this.advertisement + `/editAdvertisement?id=${id}`;
    return this.http.get<advertisement[]>(URL, httpOptions);
  }
  public changeVisible( id , visible) {
    let URL =
      this.advertisement + `?_id=${id}`;
    return this.http.patch(URL, { visible: visible }, httpOptions);
  }
  public deleteSatatus(id) {
    let URL =
      this.advertisement + `/deleteStatuts/`;
    return this.http.patch(URL, { _id: id }, httpOptions);
  }
  public editAdvertisement(info){
    let URL =
      this.advertisement + `/editAdvertisement/`;
      return this.http.put(URL,info,httpOptions);
  }
  public getprice(type, fiat) {
    let url = `https://api.coinmarketcap.com/v1/ticker/${type}/?convert=${fiat}`;
    return this.http.get(url);
  }
}
