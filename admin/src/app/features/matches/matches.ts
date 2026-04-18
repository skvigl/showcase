import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, map } from 'rxjs';

import {
  Datatable,
  DatatableAction,
  DatatableColumn,
  EMPTY_COLLECTION,
} from '@shared/datatable/datatable';
import { NotificationService } from '@core/notification/notification.service';
import { PaginatedCollection } from '@app/types/collection';
import { MatchService } from './match.service';
import { TournamentService } from '@features/tournaments/tournament.service';
import { TeamService } from '@features/teams/team.service';
import type { Match } from '@app/types';

@Component({
  selector: 'app-matches',
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, Datatable, MatSelectModule],
  templateUrl: './matches.html',
  styleUrl: './matches.scss',
})
export class Matches {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notification = inject(NotificationService);
  private tournamentsService = inject(TournamentService);
  private teamService = inject(TeamService);
  private matchService = inject(MatchService);
  private pageIndex = signal(0);
  private pageSize = signal(10);
  private reload = signal(0);

  tournaments = toSignal(this.tournamentsService.getMany().pipe(map((res) => res.items)), {
    initialValue: [],
  });
  tournamentMap = computed(() => new Map(this.tournaments().map((ev) => [ev.id, ev.name])));
  teamMap = toSignal(
    this.teamService.getMany().pipe(map((res) => new Map(res.items.map((t) => [t.id, t.name])))),
    { initialValue: new Map<string, string>() },
  );
  matches = signal<PaginatedCollection<Match>>(EMPTY_COLLECTION);

  matchColumns: DatatableColumn<Match>[] = [
    { key: 'id', header: 'ID' },
    {
      key: 'tournamentId',
      header: 'Tournament',
      cell: (m) => {
        const tournamentName = m.tournamentId
          ? this.tournamentMap().get(m.tournamentId)
          : undefined;

        return tournamentName ?? 'Unknown tournament';
      },
    },
    { key: 'date', header: 'Date', cell: (m) => new Date(m.date).toLocaleString() },
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
    { key: 'createdAt', header: 'Created At', cell: (m) => new Date(m.createdAt).toLocaleString() },
    { key: 'updatedAt', header: 'Updated At', cell: (m) => new Date(m.updatedAt).toLocaleString() },
  ];
  matchActions: DatatableAction<Match>[] = [
    { label: 'View', icon: 'view', onClick: (m) => this.router.navigate(['/matches', m.id]) },
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (m) => this.router.navigate(['/matches', m.id, 'edit']),
    },
    { label: 'Delete', icon: 'delete', onClick: (m) => this.deleteMatch(m) },
  ];

  filtersForm = this.fb.nonNullable.group({
    tournamentId: [''],
  });

  filters = toSignal(this.filtersForm.valueChanges, {
    initialValue: this.filtersForm.getRawValue(),
  });

  constructor() {
    this.filtersForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.pageIndex.set(0);
    });

    effect((onCleanup) => {
      this.reload();
      const page = this.pageIndex();
      const size = this.pageSize();
      const filters = this.filters();

      const sub = this.matchService.getMany(page, size, filters).subscribe({
        next: (res) => this.matches.set(res),
        error: (err) => this.notification.error(err?.error?.message || err.message),
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  onPageChange(e: { pageIndex: number; pageSize: number }) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
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
        this.pageIndex.set(0);
        this.reload.update((r) => r + 1);
      },
      error: (err) => this.notification.error(err.message),
    });
  }
}
