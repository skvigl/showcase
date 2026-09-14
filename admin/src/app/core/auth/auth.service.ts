import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, finalize, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';

import { environment } from '@src/environments/environment';
import { AuthUser } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;
  private token = signal<string | null>(null);

  readonly accessToken = computed(() => this.token());
  readonly user = computed(() => {
    const token = this.token();

    if (!token) return null;

    try {
      return jwtDecode<AuthUser>(token);
    } catch {
      return null;
    }
  });

  private refreshRequest$: Observable<string> | null = null;

  initAuth() {
    return this.refreshToken().pipe(
      catchError(() => {
        return of(null);
      }),
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<{
        accessToken: string;
      }>(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.token.set(res.accessToken);
        }),
      );
  }

  refreshToken() {
    if (!this.refreshRequest$) {
      this.refreshRequest$ = this.http
        .post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh`, {}, { withCredentials: true })
        .pipe(
          map((res) => res.accessToken),
          tap((accessToken) => {
            this.token.set(accessToken);
          }),
          shareReplay(1),
          finalize(() => {
            this.refreshRequest$ = null;
          }),
        );
    }

    return this.refreshRequest$;
  }

  logout() {
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.token.set(null);
        this.router.navigate(['/login']);
      },
    });
  }

  hasRole(role: string): boolean {
    return this.user()?.role === role;
  }
}
