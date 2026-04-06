import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';
import { RoleGuard } from '@core/auth/role.guard';
import { Login } from '@core/auth/login/login';
import { Forbidden } from '@shared/pages/forbidden/forbidden';
import { NotFound } from '@shared/pages/not-found/not-found';
import { SidebarLayout } from '@app/layout/sidebar-layout/sidebar-layout';
import { Users } from '@features/users/users';
import { UserForm } from '@features/users/user-form/user-form';
import { Events } from '@features/events/events';
import { EventForm } from '@features/events/event-form/event-form';
import { Teams } from '@features/teams/teams';
import { TeamForm } from '@features/teams/team-form/team-form';
import { Players } from '@features/players/players';
import { PlayerForm } from '@features/players/player-form/player-form';
import { Matches } from '@features/matches/matches';
import { MatchForm } from '@features/matches/match-form/match-form';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    canActivate: [authGuard],
    component: SidebarLayout,
    children: [
      {
        path: 'events',
        children: [
          { path: '', component: Events },
          { path: 'new', component: EventForm, data: { mode: 'create' } },
          { path: ':id', component: EventForm, data: { mode: 'view' } },
          { path: ':id/edit', component: EventForm, data: { mode: 'edit' } },
        ],
      },
      {
        path: 'matches',
        children: [
          { path: '', component: Matches },
          { path: 'new', component: MatchForm, data: { mode: 'create' } },
          { path: ':id', component: MatchForm, data: { mode: 'view' } },
          { path: ':id/edit', component: MatchForm, data: { mode: 'edit' } },
        ],
      },
      {
        path: 'teams',
        children: [
          { path: '', component: Teams },
          { path: 'new', component: TeamForm, data: { mode: 'create' } },
          { path: ':id', component: TeamForm, data: { mode: 'view' } },
          { path: ':id/edit', component: TeamForm, data: { mode: 'edit' } },
        ],
      },
      {
        path: 'players',
        children: [
          { path: '', component: Players },
          { path: 'new', component: PlayerForm, data: { mode: 'create' } },
          { path: ':id', component: PlayerForm, data: { mode: 'view' } },
          { path: ':id/edit', component: PlayerForm, data: { mode: 'edit' } },
        ],
      },
      {
        path: 'users',
        canActivate: [RoleGuard],
        data: { role: 'admin' },
        children: [
          { path: '', component: Users },
          { path: 'new', component: UserForm, data: { mode: 'create' } },
          { path: ':id', component: UserForm, data: { mode: 'view' } },
          { path: ':id/edit', component: UserForm, data: { mode: 'edit' } },
        ],
      },
    ],
  },
  {
    path: 'not-found',
    component: NotFound,
  },
  {
    path: 'forbidden',
    component: Forbidden,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
