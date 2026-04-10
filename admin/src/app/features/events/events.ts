import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PaginatedCollection } from '@app/types/collection';
import { NotificationService } from '@core/notification/notification.service';
import {
  Datatable,
  DatatableAction,
  DatatableColumn,
  EMPTY_COLLECTION,
} from '@shared/datatable/datatable';
import { EventService } from './event.service';
import type { Event as IEvent } from '@app/types';

@Component({
  selector: 'app-events',
  imports: [MatButtonModule, MatIconModule, Datatable],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events {
  private router = inject(Router);
  private notification = inject(NotificationService);
  private eventService = inject(EventService);
  private pageIndex = signal(0);
  private pageSize = signal(10);
  private reload = signal(0);

  events = signal<PaginatedCollection<IEvent>>(EMPTY_COLLECTION);

  eventColumns: DatatableColumn<IEvent>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'startDate',
      header: 'Start Date',
      cell: (t) => new Date(t.startDate).toLocaleDateString(),
    },
    { key: 'endDate', header: 'End Date', cell: (t) => new Date(t.endDate).toLocaleDateString() },
    { key: 'createdAt', header: 'Created At', cell: (t) => new Date(t.createdAt).toLocaleString() },
    { key: 'updatedAt', header: 'Updated At', cell: (t) => new Date(t.updatedAt).toLocaleString() },
  ];
  eventActions: DatatableAction<IEvent>[] = [
    { label: 'View', icon: 'view', onClick: (t) => this.router.navigate(['/events', t.id]) },
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (t) => this.router.navigate(['/events', t.id, 'edit']),
    },
    { label: 'Delete', icon: 'delete', onClick: (t) => this.deleteEvent(t) },
  ];

  constructor() {
    effect((onCleanup) => {
      this.reload();
      const page = this.pageIndex();
      const size = this.pageSize();

      const sub = this.eventService.getMany(page, size).subscribe({
        next: (res) => this.events.set(res),
        error: (err) => this.notification.error(err?.error?.message || err.message),
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  createEvent() {
    this.router.navigate(['/events', 'new']);
  }

  editEvent(event: IEvent) {
    this.router.navigate(['/events', event.id, 'edit']);
  }

  deleteEvent(event: IEvent) {
    this.eventService.delete(event.id).subscribe({
      next: () => {
        this.notification.success('Deleted');
        this.pageIndex.set(0);
        this.reload.update((r) => r + 1);
      },
      error: (err) => this.notification.error(err.message),
    });
  }
}
