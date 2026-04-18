import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NotificationService } from '../../core/notification/notification.service';
import { TeamService } from './team.service';
import type { PaginatedCollection } from '../../types/collection';
import type { Team } from '../../types';
import {
  DatatableAction,
  DatatableColumn,
  Datatable,
  EMPTY_COLLECTION,
} from '../../shared/datatable/datatable';

@Component({
  selector: 'app-teams',
  imports: [MatButtonModule, MatIconModule, Datatable],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams {
  private router = inject(Router);
  private notification = inject(NotificationService);
  private teamService = inject(TeamService);
  private pageIndex = signal(0);
  private pageSize = signal(10);
  private reload = signal(0);

  teams = signal<PaginatedCollection<Team>>(EMPTY_COLLECTION);

  teamColumns: DatatableColumn<Team>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'createdAt', header: 'Created At', cell: (t) => new Date(t.createdAt).toLocaleString() },
    { key: 'updatedAt', header: 'Updated At', cell: (t) => new Date(t.updatedAt).toLocaleString() },
  ];
  teamActions: DatatableAction<Team>[] = [
    { label: 'View', icon: 'view', onClick: (t) => this.router.navigate(['/teams', t.id]) },
    { label: 'Edit', icon: 'edit', onClick: (t) => this.router.navigate(['/teams', t.id, 'edit']) },
    { label: 'Delete', icon: 'delete', onClick: (t) => this.deleteTeam(t) },
  ];

  constructor() {
    effect((onCleanup) => {
      this.reload();
      const page = this.pageIndex();
      const size = this.pageSize();

      const sub = this.teamService.getMany(page, size).subscribe({
        next: (res) => this.teams.set(res),
        error: (err) => this.notification.error(err?.error?.message || err.message),
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  onPageChange(e: { pageIndex: number; pageSize: number }) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  createTeam() {
    this.router.navigate(['/teams', 'new']);
  }

  editTeam(team: Team) {
    this.router.navigate(['/teams', team.id, 'edit']);
  }

  deleteTeam(team: Team) {
    this.teamService.delete(team.id).subscribe({
      next: () => {
        this.notification.success('Deleted');
        this.pageIndex.set(0);
        this.reload.update((r) => r + 1);
      },
      error: (err) => this.notification.error(err.message),
    });
  }
}
