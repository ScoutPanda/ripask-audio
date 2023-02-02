import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {GlobalsService} from "../globals.service";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(private globals: GlobalsService, private router: Router) {
  }

  canActivate(): boolean | Observable<boolean> {
    if (this.globals.authenticated) {
      return true;
    } else {
      return this.globals.isAuthenticated().pipe(tap(v => {
        if (!v) {
          this.router.navigate(["account"]).then();
        }
      }));
    }
  }
}
