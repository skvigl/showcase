import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@src/environments/environment';
import { BaseCrudService } from '@core/api/base-crud.service';
import type { Team } from '@app/types';

@Injectable({ providedIn: 'root' })
export class TeamService extends BaseCrudService<Team> {
  constructor() {
    super(inject(HttpClient), `${environment.apiUrl}/teams`);
  }
}
