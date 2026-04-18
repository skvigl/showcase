import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Match } from '@app/types';
import { NotificationService } from '@core/notification/notification.service';
import { TournamentService } from '@features/tournaments/tournament.service';
import { TeamService } from '@features/teams/team.service';
import { MatchService } from '../match.service';
import { FormPageToolbar } from '@shared/form-page-toolbar/form-page-toolbar';
import { Form } from '@shared/form/form';
import { FormRow } from '@shared/form/form-row/form-row';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { map } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-match-form',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatSelectModule,
    MatRadioModule,
    Form,
    FormRow,
    FormPageToolbar,
  ],
  templateUrl: './match-form.html',
  styleUrl: './match-form.scss',
})
export class MatchForm {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private notification = inject(NotificationService);
  private tournamentService = inject(TournamentService);
  private teamService = inject(TeamService);
  private matchService = inject(MatchService);

  match = signal<Match | null>(null);

  private paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  readonly id = computed(() => this.paramMap().get('id'));

  private data = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });
  readonly mode = computed(() => this.data()['mode']);

  tournaments = toSignal(this.tournamentService.getMany().pipe(map((res) => res.items)), {
    initialValue: [],
  });
  tournamentMap = computed(() => new Map(this.tournaments().map((ev) => [ev.id, ev.name])));

  teams = toSignal(this.teamService.getMany().pipe(map((res) => res.items)), { initialValue: [] });
  teamMap = computed(() => new Map(this.teams().map((t) => [t.id, t.name])));

  private startOfDayUTC(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
  }

  form = this.fb.nonNullable.group({
    id: '',
    date: [this.startOfDayUTC(new Date()), Validators.required],
    time: [this.startOfDayUTC(new Date()), Validators.required],
    tournamentId: ['tba', Validators.required],
    status: this.fb.nonNullable.control<Match['status']>('scheduled', {
      validators: [Validators.required],
    }),
    homeTeamId: this.fb.control<string>('tba'),
    awayTeamId: this.fb.control<string>('tba'),
    homeTeamScore: [0, Validators.min(0)],
    awayTeamScore: [0, Validators.min(0)],
  });

  constructor() {
    const id = this.id();

    if (!id) {
      return;
    }

    this.matchService.getOne(id).subscribe((match) => {
      this.match.set(match);

      this.form.reset({
        id: match.id,
        tournamentId: match.tournamentId,
        date: new Date(match.date),
        time: new Date(match.date),
        status: match.status,
        homeTeamId: match.homeTeamId === null ? 'tba' : match.homeTeamId,
        awayTeamId: match.awayTeamId === null ? 'tba' : match.awayTeamId,
        homeTeamScore: match.homeTeamScore,
        awayTeamScore: match.awayTeamScore,
      });

      this.form.markAsPristine();
    });
  }

  enableEdit() {
    const match = this.match();

    if (!match) return;

    this.router.navigate(['/matches', match.id, 'edit']);
  }

  cancelEdit() {
    if (this.mode() === 'create') {
      this.goToList();
      return;
    }
    const match = this.match();

    if (!match) return;

    this.router.navigate(['/matches', match.id]);
  }

  save() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const d = raw.date;
    const t = raw.time;

    const matchDate = new Date(
      Date.UTC(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        t.getUTCHours(),
        t.getUTCMinutes(),
        t.getUTCSeconds(),
      ),
    ).toISOString();

    const payload = {
      tournamentId: raw.tournamentId,
      date: matchDate,
      status: raw.status,
      homeTeamId: raw.homeTeamId === 'tba' ? null : raw.homeTeamId,
      awayTeamId: raw.awayTeamId === 'tba' ? null : raw.awayTeamId,
      homeTeamScore: raw.homeTeamScore,
      awayTeamScore: raw.awayTeamScore,
    };

    console.log(payload);

    if (this.mode() === 'create') {
      this.matchService.create(payload).subscribe({
        next: (created) => {
          this.notification.success('Match created');
          this.router.navigate(['/matches', created.id]);
        },
        error: (err) => this.notification.error(err.message),
      });
      return;
    }

    const match = this.match();

    if (!match) return;

    this.matchService.update(match.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/matches', match.id]);
        this.notification.success('Match updated');
      },
      error: (err) => this.notification.error(err.message),
    });
  }

  goToList() {
    this.router.navigate(['/matches']);
  }

  getTournamentName(id: string | null | undefined) {
    const tournamentName = id ? this.tournamentMap().get(id) : undefined;

    return tournamentName ?? 'TBA';
  }

  getTeamName(id: string | null | undefined) {
    const teamName = id ? this.teamMap().get(id) : undefined;

    return teamName ?? 'TBA';
  }
}
