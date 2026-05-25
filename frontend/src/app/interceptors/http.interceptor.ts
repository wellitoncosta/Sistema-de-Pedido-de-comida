import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('✓ HTTP Response:', {
            url: event.url,
            status: event.status,
            body: event.body
          });
        }
      }),
      catchError(error => {
        console.error('✗ HTTP Error:', {
          url: error.url,
          status: error.status,
          message: error.message,
          error: error.error
        });
        throw error;
      })
    );
  }
}
