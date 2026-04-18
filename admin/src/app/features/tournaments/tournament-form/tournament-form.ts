import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../tournament.service';
import { NotificationService } from '@core/notification/notification.service';

import type { Tournament } from '@app/types';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Form } from '@shared/form/form';
import { FormRow } from '@shared/form/form-row/form-row';
import { FormPageToolbar } from '@shared/form-page-toolbar/form-page-toolbar';

@Component({
  selector: 'app-tournament-form',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    Form,
    FormRow,
    FormPageToolbar,
  ],
  templateUrl: './tournament-form.html',
  styleUrl: './tournament-form.scss',
})
export class TournamentForm {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private tournamentService = inject(TournamentService);
  private notification = inject(NotificationService);

  tournament = signal<Tournament | null>(null);

  private paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  readonly id = computed(() => this.paramMap().get('id'));

  private data = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });
  readonly mode = computed(() => this.data()['mode']);

  private startOfDayUTC(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
  }

  form = this.fb.nonNullable.group({
    id: '',
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]],
    startDate: [this.startOfDayUTC(new Date()), Validators.required],
    endDate: [this.startOfDayUTC(new Date()), Validators.required],
  });

  constructor() {
    const id = this.id();

    if (!id) {
      return;
    }

    this.tournamentService.getOne(id).subscribe((tr) => {
      this.tournament.set(tr);

      this.form.reset({
        id: tr.id,
        name: tr.name,
        startDate: new Date(tr.startDate),
        endDate: new Date(tr.endDate),
      });

      this.form.markAsPristine();
    });
  }

  enableEdit() {
    const tournament = this.tournament();

    if (!tournament) return;

    this.router.navigate(['/tournaments', tournament.id, 'edit']);
  }

  cancelEdit() {
    if (this.mode() === 'create') {
      this.goToList();
      return;
    }

    const tournament = this.tournament();

    if (!tournament) return;

    this.router.navigate(['/tournaments', tournament.id]);
  }

  save() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const payload = {
      name: raw.name,
      startDate: this.startOfDayUTC(raw.startDate).toISOString(),
      endDate: this.startOfDayUTC(raw.endDate).toISOString(),
    };

    if (this.mode() === 'create') {
      this.tournamentService.create(payload).subscribe({
        next: (created) => {
          this.notification.success('Tournament created');
          this.router.navigate(['/tournaments', created.id]);
        },
        error: (err) => this.notification.error(err.message),
      });
      return;
    }

    const tournament = this.tournament();

    if (!tournament) return;

    this.tournamentService.update(tournament.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/tournaments', tournament.id]);
        this.notification.success('Tournament updated');
      },
      error: (err) => this.notification.error(err.message),
    });
  }

  goToList() {
    this.router.navigate(['/tournaments']);
  }
}
