import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  saveSessionData(userData: UserDetails) {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', userData._id);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    return localStorage.getItem('user');
  }

  clearSession() {
    localStorage.removeItem('token');
  }

  private _getHeaders() {
    const httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json; version=2')
      .set('Authorization', 'JWT ' + this.getToken());
    return httpHeaders;
  }

  login(credentials): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.post(environment.url.user + '/login', credentials).subscribe(
        (response: any) => {
          this.saveSessionData(response);
          resolve(response);
        },
        (err: any) => {
          reject(err);
        }
      );
    });
  }

  logout(): void {
    this.delete('user', '/logout').subscribe(
      () => {
        this.clearSession();
        this.router.navigate(['']);
      },
      err => console.error(err)
    );
  }

  get(type, url, options?: GetOptions): Observable<any> {
    let urlParams = new HttpParams();
    if (!options) { options = {}; }

    if (options.page) { urlParams = urlParams.set('page', options.page.toString()); }
    if (options.count) { urlParams = urlParams.set('count', options.count.toString()); }
    if (options.select) { urlParams = urlParams.set('select', options.select); }
    if (options.sort) { urlParams = urlParams.set('sort', options.sort); }
    if (options.filter) { urlParams = urlParams.set('filter', JSON.stringify(options.filter)); }

    const URL = environment.url[type] + url;
    return this.http
      .get(URL, { params: urlParams, headers: this._getHeaders() });
  }

  put(type, url, data?): Observable<any> {
    const URL = environment.url[type] + url;
    return this.http
      .put(URL, data, { headers: this._getHeaders() });
  }

  post(type, url, data): Observable<any> {
    const URL = environment.url[type] + url;
    return this.http
      .post(URL, data, { headers: this._getHeaders() });
  }

  delete(type, url, data?): Observable<any> {
    const URL = environment.url[type] + url;
    return new Observable(observe => {
      this.http
        .request(
          new HttpRequest('DELETE', URL, data, {
            headers: this._getHeaders()
          })
        )
        .subscribe(
          (event: HttpEvent<any>) => {
            if (event.type === HttpEventType.Response) {
              if (event.status >= 200 && event.status < 300) {
                observe.next(event.body);
              } else {
                observe.error(event.body);
              }
            }
          },
          err => {
            observe.error(err);
          }
        );
    });
  }
}

export interface UserDetails {
  _id?: string;
  token?: string;
}

export interface GetOptions {
  page?: number;
  count?: number;
  select?: string;
  sort?: string;
  filter?: any;
  app?: string;
  noApp?: boolean;
  serviceIds?: string;
}