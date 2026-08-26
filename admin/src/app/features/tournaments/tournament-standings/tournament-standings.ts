import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { TournamentService } from '../tournament.service';
import { NotificationService } from '@core/notification/notification.service';
import { FormPageToolbar } from '@shared/form-page-toolbar/form-page-toolbar';
import { TeamLeaderboard } from '@app/types';

export type StandingRow = TeamLeaderboard & { place: number };

@Component({
  selector: 'app-tournament-standings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatCardModule,
    FormPageToolbar,
  ],
  templateUrl: './tournament-standings.html',
  styleUrl: './tournament-standings.scss',
})
export class TournamentStandings {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tournamentService = inject(TournamentService);
  private notification = inject(NotificationService);

  private paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  readonly id = computed(() => this.paramMap().get('id'));

  mode = signal<'view' | 'edit'>('edit');
  rows = signal<StandingRow[]>([]);
  placeOptions = computed(() => Array.from({ length: this.rows().length }, (_, i) => i + 1));

  displayedColumns = ['place', 'name', 'points', 'goalsScored', 'goalsConceded', 'diff'];

  constructor() {
    const tournamentId = this.id();
    if (!tournamentId) return;

    forkJoin({
      leaderboard: this.tournamentService.getLeaderboard(tournamentId),
      savedStandings: this.tournamentService
        .getStandings(tournamentId)
        .pipe(catchError(() => of({ items: [] }))),
    }).subscribe({
      next: ({ leaderboard, savedStandings }) => {
        const standingsMap = new Map<string, number>(
          savedStandings.items.map((s) => [s.teamId, s.place]),
        );

        const isAlreadySaved = savedStandings.items.length > 0;

        if (isAlreadySaved) {
          this.mode.set('view');
        }

        const mergedRows: StandingRow[] = leaderboard.items
          .map((team, index) => ({
            ...team,
            place: standingsMap.get(team.id) ?? index + 1,
          }))
          .sort((a, b) => a.place - b.place);

        this.rows.set(mergedRows);
      },
      error: (err) => {
        this.notification.error(err?.error?.message || err.message);
      },
    });
  }

  onPlaceChange(teamId: string, newPlace: number) {
    this.rows.update((currentRows) => {
      const targetRow = currentRows.find((r) => r.id === teamId);

      if (!targetRow || targetRow.place === newPlace) return currentRows;

      const oldPlace = targetRow.place;

      return currentRows
        .map((row) => {
          if (row.id === teamId) {
            return { ...row, place: newPlace };
          }

          if (row.place === newPlace) {
            return { ...row, place: oldPlace };
          }

          return row;
        })
        .sort((a, b) => a.place - b.place);
    });
  }

  update() {
    const tournamentId = this.id();
    if (!tournamentId) return;

    const payload = this.rows().map((r) => ({
      teamId: r.id,
      place: r.place,
    }));

    this.tournamentService.updateStandings(tournamentId, payload).subscribe({
      next: () => {
        this.notification.success('Standings updated successfully');
        this.mode.set('view');
      },
      error: (err) => this.notification.error(err?.error?.message || err.message),
    });
  }

  enableEdit() {
    this.mode.set('edit');
  }

  cancelEdit() {
    const tournamentId = this.id();

    if (!tournamentId) return;

    this.mode.set('view');
  }

  goToList() {
    this.router.navigate(['/tournaments']);
  }
}
