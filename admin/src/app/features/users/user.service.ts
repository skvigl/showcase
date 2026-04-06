import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@src/environments/environment';
import { BaseCrudService } from '@core/api/base-crud.service';
import type { User } from '@app/types/user';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseCrudService<User> {
  constructor() {
    super(inject(HttpClient), `${environment.apiUrl}/users`);
  }
}
