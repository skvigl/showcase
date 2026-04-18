import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@src/environments/environment';
import { BaseCrudService } from '@core/api/base-crud.service';
import type { Tournament as Tournament } from '@app/types';

@Injectable({ providedIn: 'root' })
export class TournamentService extends BaseCrudService<Tournament> {
  constructor() {
    super(inject(HttpClient), `${environment.apiUrl}/tournaments`);
  }
}
