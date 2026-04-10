import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { UserService } from './user.service';
import {
  Datatable,
  DatatableAction,
  DatatableColumn,
  EMPTY_COLLECTION,
} from '@shared/datatable/datatable';
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
  private pageIndex = signal(0);
  private pageSize = signal(10);
  private reload = signal(0);

  users = signal<PaginatedCollection<User>>(EMPTY_COLLECTION);

  userColumns: DatatableColumn<User>[] = [
    { key: 'id', header: 'ID' },
    { key: 'email', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'createdAt', header: 'Created At', cell: (u) => new Date(u.createdAt).toLocaleString() },
    { key: 'updatedAt', header: 'Updated At', cell: (u) => new Date(u.updatedAt).toLocaleString() },
  ];
  userActions: DatatableAction<User>[] = [
    { label: 'View', icon: 'view', onClick: (u) => this.router.navigate(['/users', u.id]) },
    { label: 'Edit', icon: 'edit', onClick: (u) => this.router.navigate(['/users', u.id, 'edit']) },
    { label: 'Delete', icon: 'delete', onClick: (u) => this.deleteUser(u) },
  ];

  constructor() {
    effect((onCleanup) => {
      this.reload();
      const page = this.pageIndex();
      const size = this.pageSize();

      const sub = this.userService.getMany(page, size).subscribe({
        next: (res) => this.users.set(res),
        error: (err) => this.notification.error(err?.error?.message || err.message),
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex.set(event.pageIndex);
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
        this.pageIndex.set(0);
        this.reload.update((r) => r + 1);
      },
      error: (err) => this.notification.error(err.message),
    });
  }
}
