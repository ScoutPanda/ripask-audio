import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {toHex} from "./helpers";
import {Observable, of} from "rxjs";
import {map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  private readonly _type = "json";
  private readonly _app = "ripask-audio";
  private readonly _version = "1.16.0";
  readonly autoAlbumSize = 500;
  readonly autoPlaylistSize = 100;

  params = new HttpParams();

  private _authenticated = false;
  get authenticated(): boolean {
    return this._authenticated;
  }
  private _user = "";
  get user(): string {
    return this._user;
  }
  private _password = "";
  get password(): string {
    return this._password;
  }

  private _baseurl = "";
  get baseurl(): string {
    return this._baseurl;
  }

  constructor(private http: HttpClient) {
    this._user = localStorage.getItem("user") || "";
    this._password = localStorage.getItem("password") || "";
    this._baseurl = localStorage.getItem("baseurl") || "";
  }

  isAuthenticated(): Observable<boolean> {
    const u = this._user || localStorage.getItem("user") || "";
    const p = this._password || localStorage.getItem("password") || "";
    const baseurl = this._baseurl || localStorage.getItem("baseurl") || "";
    if (u && p && baseurl) {
      return this.ping(u, p, baseurl);
    } else {
      return of(false);
    }
  }

  setUser(user: string, password: string, baseurl: string): Observable<boolean> {
    return this.ping(user, password, baseurl);
  }

  getUrl(view: string, baseurl?: string): string {
    return `${baseurl ? baseurl : this.baseurl}/rest/${view}.view`;
  }

  private ping(user: string, password: string, baseurl: string): Observable<any> {
    const params = this.createDefaultParams(user, password);
    return this.http.get<any>(this.getUrl("ping", baseurl), {params: params})
      .pipe(
        map(v => v && v.status === "ok"),
        tap(v => {
          this._authenticated = !!v;
          this._user = user;
          this._password = password;
          this._baseurl = baseurl;
          localStorage.setItem("user", this.user);
          localStorage.setItem("password", this.password);
          localStorage.setItem("baseurl", this.baseurl);
          this.params = this.createDefaultParams(this.user, this.password);
        }));
  }

  private createDefaultParams(user: string, password: string): HttpParams {
    let params = new HttpParams();
    params = params.append("u", user);
    params = params.append("p", "enc:" + toHex(password));
    params = params.append("v", this._version);
    params = params.append("c", this._app);
    params = params.append("f", this._type);
    return params;
  }
}
