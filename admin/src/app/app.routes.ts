import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';
import { RoleGuard } from '@core/auth/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@core/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/layout/sidebar-layout/sidebar-layout').then((m) => m.SidebarLayout),
    children: [
      {
        path: 'tournaments',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('@features/tournaments/tournaments').then((m) => m.Tournaments),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('@features/tournaments/tournament-form/tournament-form').then(
                (m) => m.TournamentForm,
              ),
            data: { mode: 'create' },
          },
          {
            path: ':id',
            loadComponent: () =>
              import('@features/tournaments/tournament-form/tournament-form').then(
                (m) => m.TournamentForm,
              ),
            data: { mode: 'view' },
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('@features/tournaments/tournament-form/tournament-form').then(
                (m) => m.TournamentForm,
              ),
            data: { mode: 'edit' },
          },
        ],
      },
      {
        path: 'matches',
        children: [
          {
            path: '',
            loadComponent: () => import('@features/matches/matches').then((m) => m.Matches),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('@features/matches/match-form/match-form').then((m) => m.MatchForm),
            data: { mode: 'create' },
          },
          {
            path: ':id',
            loadComponent: () =>
              import('@features/matches/match-form/match-form').then((m) => m.MatchForm),
            data: { mode: 'view' },
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('@features/matches/match-form/match-form').then((m) => m.MatchForm),
            data: { mode: 'edit' },
          },
        ],
      },
      {
        path: 'teams',
        children: [
          { path: '', loadComponent: () => import('@features/teams/teams').then((m) => m.Teams) },
          {
            path: 'new',
            loadComponent: () =>
              import('@features/teams/team-form/team-form').then((m) => m.TeamForm),
            data: { mode: 'create' },
          },
          {
            path: ':id',
            loadComponent: () =>
              import('@features/teams/team-form/team-form').then((m) => m.TeamForm),
            data: { mode: 'view' },
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('@features/teams/team-form/team-form').then((m) => m.TeamForm),
            data: { mode: 'edit' },
          },
        ],
      },
      {
        path: 'players',
        children: [
          {
            path: '',
            loadComponent: () => import('@features/players/players').then((m) => m.Players),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('@features/players/player-form/player-form').then((m) => m.PlayerForm),
            data: { mode: 'create' },
          },
          {
            path: ':id',
            loadComponent: () =>
              import('@features/players/player-form/player-form').then((m) => m.PlayerForm),
            data: { mode: 'view' },
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('@features/players/player-form/player-form').then((m) => m.PlayerForm),
            data: { mode: 'edit' },
          },
        ],
      },
      {
        path: 'users',
        canActivate: [RoleGuard],
        data: { role: 'admin' },
        children: [
          { path: '', loadComponent: () => import('@features/users/users').then((m) => m.Users) },
          {
            path: 'new',
            loadComponent: () =>
              import('@features/users/user-form/user-form').then((m) => m.UserForm),
            data: { mode: 'create' },
          },
          {
            path: ':id',
            loadComponent: () =>
              import('@features/users/user-form/user-form').then((m) => m.UserForm),
            data: { mode: 'view' },
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('@features/users/user-form/user-form').then((m) => m.UserForm),
            data: { mode: 'edit' },
          },
        ],
      },
    ],
  },
  {
    path: 'not-found',
    loadComponent: () => import('@shared/pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: 'forbidden',
    loadComponent: () => import('@shared/pages/forbidden/forbidden').then((m) => m.Forbidden),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
