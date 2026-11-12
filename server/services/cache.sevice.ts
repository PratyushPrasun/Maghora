import { redisClient } from "../config/redis.js";

class CacheService {

  // Get cached data
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data) as T;
    } catch (error) {
      console.error("Cache GET error:", error);
      return null;
    }
  }

  // Store data in Redis
  async set(
    key: string,
    value: unknown,
    expiry = 300
  ): Promise<void> {
    try {
      await redisClient.set(
        key,
        JSON.stringify(value),
        { EX: expiry }
      );
    } catch (error) {
      console.error("Cache SET error:", error);
    }
  }

  // Delete a particular cache
  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error("Cache DELETE error:", error);
    }
  }

  // Delete caches matching a pattern
  async deleteByPattern(pattern: string): Promise<void> {
    try {
      for await (const key of redisClient.scanIterator({
        MATCH: pattern,
        COUNT: 100,
      })) {
        await redisClient.del(key);
      }
    } catch (error) {
      console.error("Cache pattern deletion error:", error);
    }
  }
}

export const cacheService = new CacheService();