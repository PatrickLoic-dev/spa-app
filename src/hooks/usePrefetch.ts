import { useEffect, useRef } from 'react';
import { prefetchChunks, observePrefetch, dnsPrefetch } from '../utils/prefetch';

/**
 * Hook for prefetching dynamic imports on component mount
 * Useful for eager prefetch of likely-needed routes/features
 */
export function usePrefetchChunks(chunkUrls: string[], eager = false) {
  useEffect(() => {
    if (eager) {
      prefetchChunks(chunkUrls);
    }
  }, [chunkUrls, eager]);
}

/**
 * Hook for lazy prefetch on intersection (when element becomes visible)
 * Reduces initial bundle impact, prefetches only when needed
 */
export function useLazyPrefetch(chunkUrls: string[], rootMargin = '50px') {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = observePrefetch(ref.current, chunkUrls, { rootMargin });
    return () => observer?.disconnect();
  }, [chunkUrls, rootMargin]);

  return ref;
}

/**
 * Hook for DNS prefetch of external domains (Supabase, Sentry, etc.)
 */
export function useDnsPrefetch(domains: string[]) {
  useEffect(() => {
    domains.forEach(domain => dnsPrefetch(domain));
  }, [domains]);
}
