import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { UserService } from './user.service';
import { Datatable, DatatableAction, DatatableColumn } from '@shared/datatable/datatable';
import { NotificationService } from '@core/notification/notification.service';
import { PaginatedCollection } from '@app/types/collection';
import { User } from '@app/types/user';

@Component({
  selector: 'app-users',
  imports: [Datatable, MatButtonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private router = inject(Router);
  private notification = inject(NotificationService);
  private userService = inject(UserService);
  private pageNumber = signal(0);
  private pageSize = signal(10);

  users = signal<PaginatedCollection<User>>({
    meta: {
      pageNumber: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    },
    items: [],
  });

  userColumns: DatatableColumn<User>[] = [
    { key: 'id', header: 'ID' },
    { key: 'email', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'createdAt', header: 'Created At', cell: (t) => new Date(t.createdAt).toLocaleString() },
    { key: 'updatedAt', header: 'Updated At', cell: (t) => new Date(t.updatedAt).toLocaleString() },
  ];
  userActions: DatatableAction<User>[] = [
    { label: 'View', icon: 'view', onClick: (t) => this.router.navigate(['/users', t.id]) },
    { label: 'Edit', icon: 'edit', onClick: (t) => this.router.navigate(['/users', t.id, 'edit']) },
    { label: 'Delete', icon: 'delete', onClick: (t) => this.deleteUser(t) },
  ];

  constructor() {
    effect(() => {
      const page = this.pageNumber();
      const size = this.pageSize();

      this.userService.getMany(page, size).subscribe({
        next: (res) => this.users.set(res),
        error: (err) => this.notification.error(err?.error?.message || err.message),
      });
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  createUser() {
    this.router.navigate(['/users', 'new']);
  }

  editUser(user: User) {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  deleteUser(user: User) {
    this.userService.delete(user.id).subscribe({
      next: () => {
        this.notification.success('Deleted');
        this.pageNumber.set(0);
      },
      error: (err) => this.notification.error(err.message),
    });
  }
}
