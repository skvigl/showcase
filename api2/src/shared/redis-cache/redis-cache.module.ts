import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Module({})
export class RedisCacheModule {
  static register(namespace: string): DynamicModule {
    const cacheProvider: Provider = {
      provide: CACHE_MANAGER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.getOrThrow<string>('REDIS_HOST');
        const port = configService.getOrThrow<number>('REDIS_PORT');

        return new Keyv({
          store: new KeyvRedis(`redis://${host}:${port}`),
          namespace: namespace,
        });
      },
    };

    return {
      module: RedisCacheModule,
      providers: [cacheProvider],
      exports: [cacheProvider],
    };
  }
}
