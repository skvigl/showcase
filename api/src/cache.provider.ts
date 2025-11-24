import { Redis } from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

export interface ICacheProvider {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, data: unknown, ttlSeconds: number) => Promise<"OK">;
  del: (keys: string[]) => Promise<number>;
}

class CacheProvider implements ICacheProvider {
  async get<T>(key: string) {
    const cached = await redis.get(key);

    if (!cached) return null;

    return JSON.parse(cached) as T;
  }

  async set(key: string, value: unknown, ttlSeconds: number) {
    return await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }

  async del(keys: string[]) {
    return await redis.del(keys);
  }
}

let instance: CacheProvider | null = null;

export function createCacheProvider(): CacheProvider {
  if (instance) return instance;

  instance = new CacheProvider();

  return instance;
}
