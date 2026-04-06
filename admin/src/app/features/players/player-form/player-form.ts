import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../player.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map } from 'rxjs';

import { NotificationService } from '@core/notification/notification.service';
import { Form } from '@shared/form/form';
import { FormRow } from '@shared/form/form-row/form-row';
import { Player } from '@app/types';
import { TeamService } from '@features/teams/team.service';
import { FormPageToolbar } from '@shared/form-page-toolbar/form-page-toolbar';

@Component({
  selector: 'app-player-form',
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, Form, FormRow, FormPageToolbar],
  templateUrl: './player-form.html',
  styleUrl: './player-form.scss',
})
export class PlayerForm {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private notification = inject(NotificationService);
  private playerService = inject(PlayerService);
  private teamService = inject(TeamService);

  private paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  readonly id = computed(() => this.paramMap().get('id'));

  private data = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });
  readonly mode = computed(() => this.data()['mode']);

  teams = toSignal(this.teamService.getMany().pipe(map((res) => res.items)), { initialValue: [] });
  teamMap = computed(() => new Map(this.teams().map((t) => [t.id, t.name])));
  player = signal<Player | null>(null);

  form = this.fb.nonNullable.group({
    id: '',
    firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]],
    power: [0, [Validators.required, Validators.min(40), Validators.max(60)]],
    teamId: this.fb.control<string>('free-agent'),
  });

  fullName = computed(() =>
    [this.player()?.firstName, this.player()?.lastName].filter(Boolean).join(' '),
  );

  constructor() {
    const id = this.id();

    if (!id) {
      return;
    }
    this.playerService.getOne(id).subscribe((player) => {
      this.player.set(player);

      this.form.reset({
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        power: player.power,
        teamId: player.teamId === null ? 'free-agent' : player.teamId,
      });

      this.form.markAsPristine();
    });
  }

  enableEdit() {
    const player = this.player();

    if (!player) return;

    this.router.navigate(['/players', player.id, 'edit']);
  }

  cancelEdit() {
    if (this.mode() === 'create') {
      this.goToList();
      return;
    }

    const player = this.player();

    if (!player) return;

    this.router.navigate(['/players', player.id]);
  }

  save() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const payload = {
      firstName: raw.firstName,
      lastName: raw.lastName,
      power: raw.power,
      teamId: raw.teamId === 'free-agent' ? null : raw.teamId,
    };

    if (this.mode() === 'create') {
      this.playerService.create(payload).subscribe({
        next: (created) => {
          this.notification.success('Player created');
          this.router.navigate(['/players', created.id]);
        },
        error: (err) => this.notification.error(err.message),
      });
      return;
    }

    const player = this.player();

    if (!player) return;

    this.playerService.update(player.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/players', player.id]);
        this.notification.success('Player updated');
      },
      error: (err) => this.notification.error(err.message),
    });
  }

  goToList() {
    this.router.navigate(['/players']);
  }

  getTeamName(id: string | null | undefined) {
    const teamName = id ? this.teamMap().get(id) : undefined;

    return teamName ?? 'Free agent';
  }
}
