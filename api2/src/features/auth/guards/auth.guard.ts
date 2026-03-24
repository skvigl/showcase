import { Request } from 'express';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

type InternalRequest = Request & {
  user?: {
    isInternal?: boolean;
  };
};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<InternalRequest>();

    const simulatorToken = request.headers['x-simulator-token'];

    if (simulatorToken === process.env.SIMULATOR_TOKEN) {
      request.user = { isInternal: true };
      return true;
    }

    return super.canActivate(context);
  }
}
