import { Injectable } from '@nestjs/common';
import { MatchAction } from 'src/generated/prisma/client';
import {
  FailedServiceResult,
  FatalServiceResult,
  NotFoundServiceResult,
  SuccessServiceResult,
  failedServiceResult,
  fatalServiceResult,
  notFoundServiceResult,
  successServiceResult,
} from 'src/shared/types/service-result';
import { Paginated } from 'src/shared/types/paginations';
import { CreateMatchActionDto } from './dto/create-match-action.dto';
import { MatchActionsQueryDto } from './dto/match-actions-query.dto';
import { MatchActionsRepository } from './match-actions.repository';

@Injectable()
export class MatchActionsService {
  constructor(
    private readonly matchActionsRepository: MatchActionsRepository,
  ) {}

  async create(
    createMatchActionDto: CreateMatchActionDto,
  ): Promise<
    SuccessServiceResult<MatchAction> | FailedServiceResult | FatalServiceResult
  > {
    const result =
      await this.matchActionsRepository.create(createMatchActionDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(result.data);
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: MatchActionsQueryDto,
  ): Promise<
    SuccessServiceResult<Paginated<MatchAction>> | FatalServiceResult
  > {
    const result = await this.matchActionsRepository.findAll(query);

    switch (result.status) {
      case 'success':
        return successServiceResult(result.data);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findOneById(
    id: string,
  ): Promise<
    | SuccessServiceResult<MatchAction>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.matchActionsRepository.findOne(id);

    switch (result.status) {
      case 'success':
        return successServiceResult(result.data);
      case 'not_found':
        return notFoundServiceResult('MatchAction', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }
}
