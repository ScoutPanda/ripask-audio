import { Injectable } from "@angular/core";
import {
  HttpEvent, HttpRequest, HttpResponse,
  HttpInterceptor, HttpHandler
} from "@angular/common/http";

import {map} from "rxjs/operators";

@Injectable()
export class TransformInterceptor implements HttpInterceptor {
  intercept<T>(req: HttpRequest<T>, next: HttpHandler) {
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
