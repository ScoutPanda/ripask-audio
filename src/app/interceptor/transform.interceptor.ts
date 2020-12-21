import { Injectable } from "@angular/core";
import {
  HttpEvent, HttpRequest, HttpResponse,
  HttpInterceptor, HttpHandler
} from "@angular/common/http";

import {map} from "rxjs/operators";

@Injectable()
export class TransformInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body !== undefined && event.body["subsonic-response"] !== undefined) {
            return event.clone({body: event.body["subsonic-response"]})
          }
        }
        return event;
      })
    );
  }
}
