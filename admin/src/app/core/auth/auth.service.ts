import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, tap } from 'rxjs';

import { environment } from '@src/environments/environment';
import { AuthUser } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<AuthUser | null>(this.restoreUser());
  user$ = this.userSubject.asObservable();

  private restoreUser(): AuthUser | null {
    const token = sessionStorage.getItem('token');

    if (!token) return null;

    try {
      const decoded = jwtDecode<AuthUser>(token);

      return {
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<{
        accessToken: string;
      }>(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap((res) => {
          sessionStorage.setItem('token', res.accessToken);

          const user = jwtDecode<AuthUser>(res.accessToken);

          this.userSubject.next(user);

          this.router.navigate(['/']);
        }),
      );
  }

  refreshToken() {
    return this.http
      .post<{
        accessToken: string;
      }>(
        `${this.apiUrl}/auth/refresh`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(
        tap((res) => {
          sessionStorage.setItem('token', res.accessToken);

          const user = jwtDecode<AuthUser>(res.accessToken);
          this.userSubject.next(user);
        }),
      );
  }

  logout() {
    sessionStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  isAuth(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getUser(): AuthUser | null {
    return this.userSubject.value;
  }

  hasRole(role: string): boolean {
    return this.userSubject.value?.role === role;
  }
}
