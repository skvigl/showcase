import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = route.data['role'];
    const user = this.auth.user();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (user.role !== role) {
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  }
}
