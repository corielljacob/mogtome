/**
 * Date formatting utilities for consistent time display across the app.
 * Note: Times are approximate due to Lodestone data delays.
 */

/**
 * Format a date as a relative time string (e.g., "today", "2h ago", "3d ago").
 * Uses hours as the smallest unit since Lodestone has sync delays.
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDay = Math.floor(diffHour / 24);

  if (diffHour < 1) return 'today';
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format a date as a day string without exact time (e.g., "Mon, Jan 15").
 * Excludes time since Lodestone data has delays.
 */
export function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
