import { createHash } from "node:crypto";
import { redisClient } from "../config/redis.js";

const CACHE_TTL_SECONDS = 60;

type CacheNamespace = "products" | "categories";

const getVersion = async (
  namespace: CacheNamespace
): Promise<string> => {
  const key = `maghora:cache:${namespace}:version`;

  const version = await redisClient.get(key);

  if (version) return version;

  await redisClient.set(key, "1", {
    NX: true,
  });

  return (await redisClient.get(key)) ?? "1";
};

export const getCachedData = async <T>(
  namespace: CacheNamespace,
  input: unknown,
  fetchData: () => Promise<T>
): Promise<T> => {
  let cacheKey: string | null = null;

  try {
    const version = await getVersion(namespace);

    const hash = createHash("sha256")
      .update(JSON.stringify(input))
      .digest("hex");

    cacheKey = `maghora:cache:${namespace}:v${version}:${hash}`;

    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (error) {
    // Catalogue reads should still work if Redis is unavailable.
    console.error("Catalogue cache read failed:", error);
  }

  const data = await fetchData();

  if (cacheKey) {
    try {
      await redisClient.set(
        cacheKey,
        JSON.stringify(data),
        { EX: CACHE_TTL_SECONDS }
      );
    } catch (error) {
      console.error("Catalogue cache write failed:", error);
    }
  }

  return data;
};

export const invalidateCatalogueCache = async (
  namespace: CacheNamespace
): Promise<void> => {
  try {
    await redisClient.incr(
      `maghora:cache:${namespace}:version`
    );
  } catch (error) {
    console.error(
      `Failed to invalidate ${namespace} cache:`,
      error
    );
  }
};