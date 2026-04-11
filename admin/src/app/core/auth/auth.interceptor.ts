import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');
    const accessToken = this.auth.accessToken();
    const authReq = accessToken && !isAuthEndpoint ? this.addToken(req, accessToken) : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 401 || isAuthEndpoint) {
          return throwError(() => err);
        }

        return this.auth
          .refreshToken()
          .pipe(switchMap((newAccessToken) => next.handle(this.addToken(req, newAccessToken))));
      }),
    );
  }

  private addToken(req: HttpRequest<unknown>, token: string) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
}
