import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from '../auth.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private router = inject(Router);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  errorMessages = signal<string[]>([]);
  loading = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
  });

  constructor() {
    if (this.auth.isAuth()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.form.controls.email.valueChanges.subscribe(() => {
      console.log('errors:', this.form.controls.email.errors);
    });
  }

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();

    this.loading.set(true);

    this.auth
      .login(email, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessages.set(err?.error?.message || ['Unknown error']);
        },
      });
  }
}
