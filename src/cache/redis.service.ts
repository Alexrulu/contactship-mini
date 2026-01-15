import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService {
  private client: Redis;

  constructor(config: ConfigService) {
    this.client = new Redis({
  host: config.get("REDIS_HOST"),
  port: Number(config.get("REDIS_PORT")),
  retryStrategy: (times) => {
    return Math.min(times * 1000, 5000);
  },
  enableOfflineQueue: false,
});


    this.client.on("error", () => {
    });

    this.client.connect().catch(() => {});
  }

  get(key: string) {
    return this.client.get(key);
  }

  set(key: string, value: string, ttlSeconds: number) {
    return this.client.set(key, value, "EX", ttlSeconds);
  }
}
