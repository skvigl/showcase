import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';

import { Datatable, DatatableAction, DatatableColumn } from '@shared/datatable/datatable';
import { NotificationService } from '@core/notification/notification.service';
import { PaginatedCollection } from '@app/types/collection';
import { MatchService } from './match.service';
import { EventService } from '@features/events/event.service';
import { TeamService } from '@features/teams/team.service';
import type { Match } from '@app/types';

@Component({
  selector: 'app-matches',
  imports: [MatButtonModule, MatIconModule, Datatable],
  templateUrl: './matches.html',
  styleUrl: './matches.scss',
})
export class Matches {
  private router = inject(Router);
  private notification = inject(NotificationService);
  private eventService = inject(EventService);
  private teamService = inject(TeamService);
  private matchService = inject(MatchService);
  private pageNumber = signal(0);
  private pageSize = signal(10);

  eventMap = toSignal(
    this.eventService.getMany().pipe(map((res) => new Map(res.items.map((e) => [e.id, e.name])))),
    { initialValue: new Map<string, string>() },
  );
  teamMap = toSignal(
    this.teamService.getMany().pipe(map((res) => new Map(res.items.map((t) => [t.id, t.name])))),
    { initialValue: new Map<string, string>() },
  );
  matches = signal<PaginatedCollection<Match>>({
    meta: {
      pageNumber: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    },
    items: [],
  });

  matchColumns: DatatableColumn<Match>[] = [
    { key: 'id', header: 'ID' },
    {
      key: 'eventId',
      header: 'Event',
      cell: (m) => {
        const eventName = m.eventId ? this.eventMap().get(m.eventId) : undefined;

        return eventName ?? 'Unknown event';
      },
    },
    { key: 'date', header: 'Date', cell: (t) => new Date(t.date).toLocaleString() },
    { key: 'status', header: 'Status' },
    {
      key: 'homeTeamId',
      header: 'Home Team',
      cell: (m) => {
        const teamName = m.homeTeamId ? this.teamMap().get(m.homeTeamId) : undefined;

        return teamName ?? 'TBA';
      },
    },
    { key: 'homeTeamScore', header: 'Home Score' },
    { key: 'awayTeamScore', header: 'Away Score' },
    {
      key: 'awayTeamId',
      header: 'Away Team',
      cell: (m) => {
        const teamName = m.awayTeamId ? this.teamMap().get(m.awayTeamId) : undefined;

        return teamName ?? 'TBA';
      },
    },
    { key: 'createdAt', header: 'Created At', cell: (t) => new Date(t.createdAt).toLocaleString() },
    { key: 'updatedAt', header: 'Updated At', cell: (t) => new Date(t.updatedAt).toLocaleString() },
  ];
  matchActions: DatatableAction<Match>[] = [
    { label: 'View', icon: 'view', onClick: (t) => this.router.navigate(['/matches', t.id]) },
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (t) => this.router.navigate(['/matches', t.id, 'edit']),
    },
    { label: 'Delete', icon: 'delete', onClick: (t) => this.deleteMatch(t) },
  ];

  constructor() {
    effect(() => {
      const page = this.pageNumber();
      const size = this.pageSize();

      this.matchService.getMany(page, size).subscribe({
        next: (res) => this.matches.set(res),
        error: (err) => this.notification.error(err?.error?.message || err.message),
      });
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  createMatch() {
    this.router.navigate(['/matches', 'new']);
  }

  editMatch(match: Match) {
    this.router.navigate(['/matches', match.id, 'edit']);
  }

  deleteMatch(match: Match) {
    this.matchService.delete(match.id).subscribe({
      next: () => {
        this.notification.success('Deleted');
        this.pageNumber.set(0);
      },
      error: (err) => this.notification.error(err.message),
    });
  }
}
