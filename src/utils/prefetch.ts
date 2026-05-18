/**
 * Prefetch utility for optimizing resource loading
 * Reduces perceived latency by preloading chunks and assets
 */

type PrefetchStrategy = 'prefetch' | 'preload' | 'dns-prefetch';

/**
 * Create or update a link tag for prefetching
 */
export function createPrefetchLink(
  href: string,
  rel: PrefetchStrategy = 'prefetch',
  as?: string
): HTMLLinkElement {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (as) link.as = as;
  document.head.appendChild(link);
  return link;
}

/**
 * Prefetch a JavaScript chunk by URL
 */
export function prefetchScript(chunkUrl: string): void {
  createPrefetchLink(chunkUrl, 'prefetch', 'script');
}

/**
 * Prefetch multiple chunks (e.g., on route hover or intersection)
 */
export function prefetchChunks(chunkUrls: string[]): void {
  chunkUrls.forEach(url => prefetchScript(url));
}

/**
 * Hook-friendly prefetcher with IntersectionObserver pattern
 * Prefetch when element becomes visible (lazy prefetch)
 */
export function observePrefetch(
  element: HTMLElement | null,
  chunkUrls: string[],
  options: IntersectionObserverInit = { rootMargin: '50px' }
): IntersectionObserver | null {
  if (!element || !('IntersectionObserver' in window)) return null;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        prefetchChunks(chunkUrls);
        observer.unobserve(element);
      }
    });
  }, options);

  observer.observe(element);
  return observer;
}

/**
 * DNS prefetch for external API/domain (e.g., Supabase, Sentry)
 */
export function dnsPrefetch(domain: string): void {
  createPrefetchLink(`https://${domain}`, 'dns-prefetch');
}

/**
 * Preload a critical resource (font, image)
 */
export function preloadResource(href: string, as: 'font' | 'image' | 'style' | 'script'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (as === 'font') link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Cleanup: remove a prefetch link
 */
export function removePrefetch(href: string): void {
  const link = document.querySelector(`link[href="${href}"]`);
  if (link) link.remove();
}
