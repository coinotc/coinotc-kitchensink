import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiServiceProvider } from '../api-service/api-service';
import { Observable} from 'rxjs/Rx';

/*
  Generated class for the CurrenciesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CurrenciesServiceProvider {
  constructor(public apiService: ApiServiceProvider) {
    console.log('CurrenciesProvider ...');
  }

  getCurrencies() {
    // /android_asset/www/assets/data/
    // ./assets/data/currencies.json
    return this.apiService.getExternal('./assets/data/currencies.json');
  }
}
