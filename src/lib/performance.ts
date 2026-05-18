/**
 * Performance initialization
 * DNS prefetch for critical external services
 */
import { dnsPrefetch, preloadResource } from '../utils/prefetch';

/**
 * Initialize performance optimizations
 * Should be called early in app startup
 */
export function initPerformance() {
  // DNS prefetch critical external services
  dnsPrefetch('o4505160924741632.ingest.sentry.io');  // Sentry ingestion
  dnsPrefetch('api.github.com');                       // GitHub API (if used)
  
  // Preload Google Fonts (already imported in index.css but explicit preload helps)
  preloadResource(
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'style'
  );
}
