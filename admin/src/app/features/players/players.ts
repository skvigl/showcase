import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { PlayerService } from './player.service';
import { PaginatedCollection } from '../../types/collection';
import { NotificationService } from '../../core/notification/notification.service';
import { MatButtonModule } from '@angular/material/button';
import {
  Datatable,
  DatatableAction,
  DatatableColumn,
  EMPTY_COLLECTION,
} from '../../shared/datatable/datatable';
import type { Player } from '../../types';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TeamService } from '../teams/team.service';

@Component({
  selector: 'app-players',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, Datatable],
  templateUrl: './players.html',
  styleUrl: './players.scss',
})
export class Players {
  private router = inject(Router);
  private notification = inject(NotificationService);
  private playerService = inject(PlayerService);
  private teamService = inject(TeamService);
  private pageIndex = signal(0);
  private pageSize = signal(10);
  private reload = signal(0);

  players = signal<PaginatedCollection<Player>>(EMPTY_COLLECTION);

  teamMap = toSignal(
    this.teamService.getMany().pipe(map((res) => new Map(res.items.map((t) => [t.id, t.name])))),
    { initialValue: new Map<string, string>() },
  );
  playerColumns: DatatableColumn<Player>[] = [
    { key: 'id', header: 'ID' },
    { key: 'firstName', header: 'FirstName' },
    { key: 'lastName', header: 'LastName' },
    { key: 'attack', header: 'Attack' },
    { key: 'defence', header: 'Defence' },
    {
      key: 'teamId',
      header: 'Team',
      cell: (p) => {
        const teamName = p.teamId ? this.teamMap().get(p.teamId) : undefined;

        return teamName ?? 'Free agent';
      },
    },
    { key: 'createdAt', header: 'Created At', cell: (p) => new Date(p.createdAt).toLocaleString() },
    { key: 'updatedAt', header: 'Updated At', cell: (p) => new Date(p.updatedAt).toLocaleString() },
  ];
  playerActions: DatatableAction<Player>[] = [
    { label: 'View', icon: 'view', onClick: (p) => this.router.navigate(['/players', p.id]) },
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (p) => this.router.navigate(['/players', p.id, 'edit']),
    },
    { label: 'Delete', icon: 'delete', onClick: (p) => this.deletePlayer(p) },
  ];

  constructor() {
    effect((onCleanup) => {
      this.reload();
      const page = this.pageIndex();
      const size = this.pageSize();

      const sub = this.playerService.getMany(page, size).subscribe({
        next: (res) => this.players.set(res),
        error: (err) => this.notification.error(err?.error?.message || err.message),
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  onPageChange(e: { pageIndex: number; pageSize: number }) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  createPlayer() {
    this.router.navigate(['/players', 'new']);
  }

  editPlayer(player: Player) {
    this.router.navigate(['/players', player.id, 'edit']);
  }

  deletePlayer(player: Player) {
    this.playerService.delete(player.id).subscribe({
      next: () => {
        this.notification.success('Deleted');
        this.pageIndex.set(0);
        this.reload.update((r) => r + 1);
      },
      error: (err) => this.notification.error(err.message),
    });
  }
}
