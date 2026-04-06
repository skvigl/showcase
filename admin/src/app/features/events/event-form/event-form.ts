import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { NotificationService } from '@core/notification/notification.service';

import type { Event as TEvent } from '@app/types';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Form } from '@shared/form/form';
import { FormRow } from '@shared/form/form-row/form-row';
import { FormPageToolbar } from '@shared/form-page-toolbar/form-page-toolbar';

@Component({
  selector: 'app-event-form',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    Form,
    FormRow,
    FormPageToolbar,
  ],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss',
})
export class EventForm {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private notification = inject(NotificationService);

  event = signal<TEvent | null>(null);

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

    this.eventService.getOne(id).subscribe((event) => {
      this.event.set(event);

      this.form.reset({
        id: event.id,
        name: event.name,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      });

      this.form.markAsPristine();
    });
  }

  enableEdit() {
    const event = this.event();

    if (!event) return;

    this.router.navigate(['/events', event.id, 'edit']);
  }

  cancelEdit() {
    if (this.mode() === 'create') {
      this.goToList();
      return;
    }

    const event = this.event();

    if (!event) return;

    this.router.navigate(['/events', event.id]);
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
      this.eventService.create(payload).subscribe({
        next: (created) => {
          this.notification.success('Event created');
          this.router.navigate(['/events', created.id]);
        },
        error: (err) => this.notification.error(err.message),
      });
      return;
    }

    const event = this.event();

    if (!event) return;

    this.eventService.update(event.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/events', event.id]);
        this.notification.success('Event updated');
      },
      error: (err) => this.notification.error(err.message),
    });
  }

  goToList() {
    this.router.navigate(['/events']);
  }
}
