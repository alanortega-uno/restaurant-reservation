import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
      const clonedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`),
      });
      return next.handle(clonedRequest);
    } else {
      return next.handle(request);
    }
  }
}
