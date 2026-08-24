import { Injectable } from '@nestjs/common';

import {
  FatalServiceResult,
  fatalServiceResult,
  NotFoundServiceResult,
  SuccessServiceResult,
  successServiceResult,
  notFoundServiceResult,
  FailedServiceResult,
  failedServiceResult,
} from 'src/shared/types/service-result';
import { CreateTournamentDto } from './dto/inbound/create-tournament.dto';
import { UpdateTournamentDto } from './dto/inbound/update-tournament.dto';
import { TournamentsQueryDto } from './dto/inbound/tournaments-query.dto';
import { TournamentWebDto } from './dto/web/tournament.web.dto';
import { TournamentDetailsWebDto } from './dto/web/tournament-details.web.dto';
import { TournamentsRepository } from './tournaments.repository';
import { mapToPublicDto, mapToPaginatedDto } from 'src/shared/helpers/mapper';
import { MatchWebDto } from '@features/matches/dto/web/match.web.dto';
import { MatchStatus } from '@features/matches/dto/inbound/create-match.dto';
import { TournamentsWebDto } from './dto/web/tournaments.web.dto';
import {
  TournamentLeaderboardWebDto,
  LeaderboardItemWebDto,
} from './dto/web/tournament-leaderboard.web.dto';
import { TournamentFeaturedMatchesWebDto } from './dto/web/tournament-featured-matches.web.dto';
import { TeamsService } from '@features/teams/teams.service';

@Injectable()
export class TournamentsService {
  constructor(
    private readonly tournamentsRepository: TournamentsRepository,
    private readonly teamsService: TeamsService,
  ) {}

  private selectFeaturedMatches(
    matches: MatchWebDto[],
    limit: number,
  ): MatchWebDto[] {
    const finished: MatchWebDto[] = [];
    const live: MatchWebDto[] = [];
    const scheduled: MatchWebDto[] = [];

    for (const match of matches) {
      if (match.status === MatchStatus.finished) finished.push(match);
      else if (match.status === MatchStatus.live) live.push(match);
      else if (match.status === MatchStatus.scheduled) scheduled.push(match);
    }

    const minFinished = Math.min(2, finished.length);

    let takeFinished = minFinished;

    const takeLive = Math.min(live.length, limit - takeFinished);

    const takeScheduled = Math.min(
      scheduled.length,
      limit - takeFinished - takeLive,
    );

    const remaining = limit - takeFinished - takeLive - takeScheduled;

    if (remaining > 0) {
      takeFinished = Math.min(finished.length, takeFinished + remaining);
    }

    return [
      ...finished.slice(-takeFinished),
      ...live.slice(0, takeLive),
      ...scheduled.slice(0, takeScheduled),
    ];
  }

  async create(
    createTournamentDto: CreateTournamentDto,
  ): Promise<
    | SuccessServiceResult<TournamentWebDto>
    | FailedServiceResult
    | FatalServiceResult
  > {
    const result = await this.tournamentsRepository.create(createTournamentDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(
          mapToPublicDto(TournamentWebDto, result.data),
        );
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: TournamentsQueryDto,
  ): Promise<SuccessServiceResult<TournamentsWebDto> | FatalServiceResult> {
    const result = await this.tournamentsRepository.findAll(query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(
          mapToPaginatedDto(TournamentWebDto, result.data),
        );
      }
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findOneById(
    id: string,
  ): Promise<
    | SuccessServiceResult<TournamentDetailsWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.tournamentsRepository.findOne(id);

    switch (result.status) {
      case 'success': {
        return successServiceResult(
          mapToPublicDto(TournamentDetailsWebDto, result.data),
        );
      }
      case 'not_found':
        return notFoundServiceResult('Tournament', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async update(
    id: string,
    updateTournamentDto: UpdateTournamentDto,
  ): Promise<
    | SuccessServiceResult<null>
    | FailedServiceResult
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.tournamentsRepository.update(
      id,
      updateTournamentDto,
    );

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'constraint':
        return failedServiceResult();
      case 'not_found':
        return notFoundServiceResult('Tournament', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async remove(
    id: string,
  ): Promise<
    SuccessServiceResult<null> | NotFoundServiceResult | FatalServiceResult
  > {
    const result = await this.tournamentsRepository.remove(id);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'not_found':
        return notFoundServiceResult('Tournament', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async getLeaderboard(
    id: string,
    limit = 10,
  ): Promise<
    | SuccessServiceResult<TournamentLeaderboardWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.tournamentsRepository.findOneWithMatches(id);

    switch (result.status) {
      case 'success': {
        const tournamentWithMatches = result.data;
        const matches = tournamentWithMatches.matches ?? [];

        const teamsResult = await this.teamsService.findAll({});

        if (teamsResult.status !== 'success') {
          return teamsResult;
        }

        const table: Record<
          string,
          {
            points: number;
            goalsScored: number;
            goalsConceded: number;
          }
        > = {};

        for (const match of matches) {
          if (match.status !== MatchStatus.finished) continue;
          if (!match.homeTeamId || !match.awayTeamId) continue;

          const { homeTeamId, awayTeamId, homeTeamScore, awayTeamScore } =
            match;

          const home = (table[homeTeamId] ??= {
            points: 0,
            goalsScored: 0,
            goalsConceded: 0,
          });
          const away = (table[awayTeamId] ??= {
            points: 0,
            goalsScored: 0,
            goalsConceded: 0,
          });

          if (homeTeamScore === awayTeamScore) {
            home.points += 1;
            away.points += 1;
          } else if (homeTeamScore > awayTeamScore) {
            home.points += 3;
          } else {
            away.points += 3;
          }

          home.goalsScored += homeTeamScore;
          home.goalsConceded += awayTeamScore;

          away.goalsScored += awayTeamScore;
          away.goalsConceded += homeTeamScore;
        }

        const teams = teamsResult.data.items;
        const items: LeaderboardItemWebDto[] = teams
          .reduce<LeaderboardItemWebDto[]>((acc, t) => {
            const stats = table[t.id];

            if (stats) {
              acc.push({
                ...t,
                points: stats.points,
                goalsScored: stats.goalsScored,
                goalsConceded: stats.goalsConceded,
              });
            }

            return acc;
          }, [])
          .sort((a, b) => {
            if (b.points !== a.points) {
              return b.points - a.points;
            }

            const diffA = a.goalsScored - a.goalsConceded;
            const diffB = b.goalsScored - b.goalsConceded;

            if (diffB !== diffA) {
              return diffB - diffA;
            }

            return b.goalsScored - a.goalsScored;
          })
          .slice(0, limit);

        return successServiceResult(
          mapToPublicDto(TournamentLeaderboardWebDto, { items }),
        );
      }
      case 'not_found':
        return notFoundServiceResult('Tournament', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async getFeaturedMatches(
    id: string,
    limit = 10,
  ): Promise<
    | SuccessServiceResult<TournamentFeaturedMatchesWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.tournamentsRepository.findOneWithMatches(id);

    switch (result.status) {
      case 'success': {
        const tournamentDetails = mapToPublicDto(
          TournamentDetailsWebDto,
          result.data,
        );
        const matches = tournamentDetails.matches ?? [];
        const featured = this.selectFeaturedMatches(matches, limit);

        return successServiceResult({
          items: featured,
        });
      }
      case 'not_found':
        return notFoundServiceResult('Tournament', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }
}
