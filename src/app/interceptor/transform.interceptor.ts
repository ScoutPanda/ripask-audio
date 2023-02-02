import { Injectable } from "@angular/core";
import {
  HttpEvent, HttpRequest, HttpResponse,
  HttpInterceptor, HttpHandler
} from "@angular/common/http";

import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable()
export class TransformInterceptor implements HttpInterceptor {
  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<{body: {"subsonic-response": unknown}}>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<{body: {"subsonic-response": unknown}}>) => {
        if (event instanceof HttpResponse) {
          if (event.body !== undefined && event.body?.["subsonic-response" as keyof object] !== undefined) {
            return event.clone({body: event.body?.["subsonic-response" as keyof object]})
          }
        }
        return event;
      })
    );
  }
}
