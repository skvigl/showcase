import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/notification/notification.service';
import { FormPageToolbar } from '@shared/form-page-toolbar/form-page-toolbar';
import { UserService } from '../user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@app/types/user';
import { Form } from '@shared/form/form';
import { FormRow } from '@shared/form/form-row/form-row';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, Form, FormRow, FormPageToolbar],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private notification = inject(NotificationService);
  private userService = inject(UserService);

  private paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  readonly id = computed(() => this.paramMap().get('id'));

  private data = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });
  readonly mode = computed(() => this.data()['mode']);

  user = signal<User | null>(null);

  form = this.fb.nonNullable.group({
    id: '',
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: this.fb.nonNullable.control<User['role']>('user', {
      validators: [Validators.required],
    }),
  });

  constructor() {
    const id = this.id();

    if (!id) {
      return;
    }
    this.userService.getOne(id).subscribe((user) => {
      this.user.set(user);

      this.form.reset({
        id: user.id,
        email: user.email,
        password: '',
        role: user.role,
      });

      this.form.markAsPristine();
    });
  }

  enableEdit() {
    const user = this.user();

    if (!user) return;

    this.router.navigate(['/users', user.id, 'edit']);
  }

  cancelEdit() {
    if (this.mode() === 'create') {
      this.goToList();
      return;
    }

    const user = this.user();

    if (!user) return;

    this.router.navigate(['/users', user.id]);
  }

  save() {
    if (this.form.invalid) return;

    const isCreateMode = this.mode() === 'create';

    const raw = this.form.getRawValue();
    const payload = {
      email: raw.email,
      password: isCreateMode ? raw.password : undefined,
      role: raw.role,
    };

    if (this.mode() === 'create') {
      this.userService.create(payload).subscribe({
        next: (created) => {
          this.notification.success('User created');
          this.router.navigate(['/users', created.id]);
        },
        error: (err) => this.notification.error(err.message),
      });
      return;
    }

    const user = this.user();

    if (!user) return;

    this.userService.update(user.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/users', user.id]);
        this.notification.success('User updated');
      },
      error: (err) => this.notification.error(err.message),
    });
  }

  goToList() {
    this.router.navigate(['/users']);
  }
}
