import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NotificationService } from '../../core/notification/notification.service';
import { TeamService } from './team.service';
import type { PaginatedCollection } from '../../types/collection';
import type { Team } from '../../types';
import { DatatableAction, DatatableColumn, Datatable } from '../../shared/datatable/datatable';

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
  private pageNumber = signal(0);
  private pageSize = signal(10);

  teams = signal<PaginatedCollection<Team>>({
    meta: {
      pageNumber: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    },
    items: [],
  });

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
    effect(() => {
      const page = this.pageNumber();
      const size = this.pageSize();

      this.teamService.getMany(page, size).subscribe({
        next: (res) => this.teams.set(res),
        error: (err) => this.notification.error(err?.error?.message || err.message),
      });
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
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
        this.pageNumber.set(0);
      },
      error: (err) => this.notification.error(err.message),
    });
  }
}
