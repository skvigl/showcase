import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@src/environments/environment';
import { BaseCrudService } from '@core/api/base-crud.service';
import { SimpleCollection } from '@app/types/collection';
import { TeamLeaderboard, Tournament } from '@app/types';

@Injectable({ providedIn: 'root' })
export class TournamentService extends BaseCrudService<Tournament> {
  constructor() {
    super(inject(HttpClient), `${environment.apiUrl}/tournaments`);
  }

  getLeaderboard(id: string) {
    return this.http.get<SimpleCollection<TeamLeaderboard>>(
      `${environment.apiUrl}/tournaments/${id}/leaderboard`,
    );
  }

  getStandings(id: string) {
    return this.http.get<SimpleCollection<{ teamId: string; place: number }>>(
      `${environment.apiUrl}/tournaments/${id}/standings`,
    );
  }

  updateStandings(id: string, payload: { teamId: string; place: number }[]) {
    return this.http.patch(`${environment.apiUrl}/tournaments/${id}/standings`, payload);
  }
}
