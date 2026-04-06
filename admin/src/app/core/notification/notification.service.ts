import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  success(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }

  error(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }

  info(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
}
