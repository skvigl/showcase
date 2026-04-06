import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@src/environments/environment';
import { BaseCrudService } from '@core/api/base-crud.service';
import type { Player } from '@app/types';

@Injectable({ providedIn: 'root' })
export class PlayerService extends BaseCrudService<Player> {
  constructor() {
    super(inject(HttpClient), `${environment.apiUrl}/players`);
  }
}
