import { Component, computed, inject, signal } from '@angular/core';
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
import { Datatable, DatatableAction, DatatableColumn } from '../../shared/datatable/datatable';
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
  private pageNumber = signal(0);
  private pageSize = signal(10);

  players = signal<PaginatedCollection<Player>>({
    meta: {
      pageNumber: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    },
    items: [],
  });

  teamMap = toSignal(
    this.teamService.getMany().pipe(map((res) => new Map(res.items.map((t) => [t.id, t.name])))),
    { initialValue: new Map<string, string>() },
  );
  playerColumns: DatatableColumn<Player>[] = [
    { key: 'id', header: 'ID' },
    { key: 'firstName', header: 'FirstName' },
    { key: 'lastName', header: 'LastName' },
    { key: 'power', header: 'Power' },
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
    { label: 'View', icon: 'view', onClick: (t) => this.router.navigate(['/players', t.id]) },
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (row) => this.router.navigate(['/players', row.id, 'edit']),
    },
    { label: 'Delete', icon: 'delete', onClick: (row) => this.deletePlayer(row) },
  ];

  constructor() {
    this.load();
  }

  load() {
    this.playerService
      .getMany(this.pageNumber(), this.pageSize())
      .subscribe((res) => this.players.set(res));
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
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
        this.load();
      },
      error: (err) => this.notification.error(err.message),
    });
  }
}
