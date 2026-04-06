import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

import { TeamService } from '../team.service';
import { NotificationService } from '@core/notification/notification.service';
import { Team } from '@app/types';
import { Form } from '@shared/form/form';
import { FormRow } from '@shared/form/form-row/form-row';
import { FormPageToolbar } from '@shared/form-page-toolbar/form-page-toolbar';

@Component({
  selector: 'app-team-form',
  imports: [ReactiveFormsModule, MatInputModule, Form, FormRow, FormPageToolbar],
  templateUrl: './team-form.html',
  styleUrl: './team-form.scss',
})
export class TeamForm {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);
  private notification = inject(NotificationService);

  team = signal<Team | null>(null);

  private paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  readonly id = computed(() => this.paramMap().get('id'));

  private data = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });
  readonly mode = computed(() => this.data()['mode']);

  form = this.fb.nonNullable.group({
    id: '',
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]],
  });

  constructor() {
    const id = this.id();

    if (!id) {
      return;
    }

    this.teamService.getOne(id).subscribe((team) => {
      this.team.set(team);

      this.form.reset({
        id: team.id,
        name: team.name,
      });

      this.form.markAsPristine();
    });
  }

  enableEdit() {
    const team = this.team();

    if (!team) return;

    this.router.navigate(['/teams', team.id, 'edit']);
  }

  cancelEdit() {
    if (this.mode() === 'create') {
      this.goToList();
      return;
    }

    const team = this.team();

    if (!team) return;

    this.router.navigate(['/teams', team.id]);
  }

  save() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const payload = {
      name: raw.name,
    };

    if (this.mode() === 'create') {
      this.teamService.create(payload).subscribe({
        next: (created) => {
          this.notification.success('Team created');
          this.router.navigate(['/teams', created.id]);
        },
        error: (err) => this.notification.error(err.message),
      });

      return;
    }

    const team = this.team();

    if (!team) return;

    this.teamService.update(team.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/teams', team.id]);
        this.notification.success('Team updated');
      },
      error: (err) => this.notification.error(err.message),
    });
  }

  goToList() {
    this.router.navigate(['/teams']);
  }
}
