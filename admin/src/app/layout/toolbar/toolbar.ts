import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
  router = inject(Router);
  auth = inject(AuthService);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
