import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);
  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

    const token = this.auth.getToken();

    let authReq = req;

    if (token && !isAuthEndpoint) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 401 || isAuthEndpoint) {
          return throwError(() => err);
        }

        if (this.refreshInProgress) {
          return this.refreshSubject.pipe(
            filter((t): t is string => t !== null),
            take(1),
            switchMap((newToken) => {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next.handle(retryReq);
            }),
          );
        }

        this.refreshInProgress = true;
        this.refreshSubject.next(null);

        return this.auth.refreshToken().pipe(
          switchMap((res) => {
            this.refreshInProgress = false;

            this.refreshSubject.next(res.accessToken);

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`,
              },
            });

            return next.handle(retryReq);
          }),
          catchError((refreshErr) => {
            this.refreshInProgress = false;

            if (refreshErr.status === 401) {
              this.auth.logout();
            }

            return throwError(() => refreshErr);
          }),
        );
      }),
    );
  }
}
