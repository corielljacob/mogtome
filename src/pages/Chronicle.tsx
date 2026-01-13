import { useState, useMemo, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Star,
  Sparkles,
  Heart,
  ChevronDown,
  UserPlus,
  UserMinus,
  Award,
  ArrowUpDown,
  Megaphone,
  HelpCircle,
  Scroll,
  Loader2,
} from 'lucide-react';
import { eventsApi } from '../api/events';
import { useEventsHub, type ConnectionStatus } from '../hooks';
import type { ChronicleEvent } from '../types';
import flyingMoogles from '../assets/moogles/moogles flying.webp';
import moogleMail from '../assets/moogles/moogle mail.webp';
import deadMoogle from '../assets/moogles/dead moogle.webp';

// Story divider matching other pages
function StoryDivider({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 20" 
      className={`w-48 md:w-64 h-5 ${className}`}
      fill="none"
    >
      <path 
        d="M10 10 Q 30 5, 50 10 T 90 10 T 130 10 T 170 10 T 190 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
        className="text-[var(--bento-primary)]/40"
      />
      <circle cx="100" cy="10" r="3" className="fill-[var(--bento-secondary)]" />
      <circle cx="80" cy="8" r="2" className="fill-[var(--bento-primary)]/50" />
      <circle cx="120" cy="8" r="2" className="fill-[var(--bento-primary)]/50" />
    </svg>
  );
}

// Floating background decoration
function FloatingBackgroundMoogles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.img
        src={flyingMoogles}
        alt=""
        aria-hidden
        className="absolute top-32 left-4 md:left-16 w-24 md:w-32 object-contain"
        style={{ rotate: '-5deg' }}
        animate={{ 
          opacity: [0.06, 0.12, 0.06],
          y: [0, -15, 0],
        }}
        transition={{
          opacity: { duration: 5, repeat: Infinity },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.img
        src={moogleMail}
        alt=""
        aria-hidden
        className="absolute top-64 right-4 md:right-16 w-20 md:w-28 object-contain"
        style={{ rotate: '8deg' }}
        animate={{ 
          opacity: [0.06, 0.12, 0.06],
          y: [0, -12, 0],
        }}
        transition={{
          opacity: { duration: 4, repeat: Infinity, delay: 1.5 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
        }}
      />
    </div>
  );
}

// Floating sparkles
function FloatingSparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[
        { left: '8%', top: '25%' },
        { left: '92%', top: '18%' },
        { left: '12%', top: '65%' },
        { left: '88%', top: '72%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={pos}
          animate={{
            y: [0, -8, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
        >
          {i % 2 === 0 ? (
            <Sparkles className="w-4 h-4 text-[var(--bento-primary)]" />
          ) : (
            <Star className="w-4 h-4 text-[var(--bento-secondary)] fill-[var(--bento-secondary)]" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Connection status indicator
function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  const statusConfig: Record<ConnectionStatus, { color: string; label: string; Icon: typeof Wifi }> = {
    connected: { color: 'text-green-500', label: 'Live', Icon: Wifi },
    connecting: { color: 'text-yellow-500', label: 'Connecting...', Icon: Wifi },
    reconnecting: { color: 'text-yellow-500', label: 'Reconnecting...', Icon: Wifi },
    disconnected: { color: 'text-[var(--bento-text-muted)]', label: 'Offline', Icon: WifiOff },
    error: { color: 'text-red-500', label: 'Error', Icon: WifiOff },
  };

  const { color, label, Icon } = statusConfig[status];

  return (
    <motion.div 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bento-card)]/80 border border-[var(--bento-border)] ${color}`}
      animate={status === 'connecting' || status === 'reconnecting' ? { opacity: [0.5, 1, 0.5] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-soft font-medium">{label}</span>
      {status === 'connected' && (
        <motion.div
          className="w-2 h-2 rounded-full bg-green-500"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// Get icon and color for event type
function getEventTypeConfig(type: string): { Icon: typeof UserPlus; color: string; bgColor: string } {
  const typeMap: Record<string, { Icon: typeof UserPlus; color: string; bgColor: string }> = {
    member_joined: { Icon: UserPlus, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    member_left: { Icon: UserMinus, color: 'text-red-400', bgColor: 'bg-red-500/10' },
    name_change: { Icon: ArrowUpDown, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    rank_change: { Icon: Award, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    fc_announcement: { Icon: Megaphone, color: 'text-[var(--bento-primary)]', bgColor: 'bg-[var(--bento-primary)]/10' },
    achievement: { Icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  };

  return typeMap[type] || { Icon: HelpCircle, color: 'text-[var(--bento-text-muted)]', bgColor: 'bg-[var(--bento-bg)]' };
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format full date
function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Get unique key for an event
function getEventKey(event: ChronicleEvent): string {
  return `${event.id.timestamp}-${event.id.creationTime}`;
}

// Single timeline event card
function TimelineEventCard({ event, isRealtime = false }: { event: ChronicleEvent; isRealtime?: boolean }) {
  const { Icon, color, bgColor } = getEventTypeConfig(event.type);
  
  return (
    <motion.div
      initial={isRealtime ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        relative flex gap-4 p-4 md:p-5
        bg-[var(--bento-card)]/80 backdrop-blur-sm
        border border-[var(--bento-border)] rounded-2xl
        shadow-sm hover:shadow-md hover:border-[var(--bento-primary)]/20
        transition-all duration-200
        ${isRealtime ? 'ring-2 ring-[var(--bento-primary)]/30 ring-offset-2 ring-offset-[var(--bento-bg)]' : ''}
      `}
    >
      {/* Event type icon */}
      <div className={`
        flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl
        flex items-center justify-center
        ${bgColor} ${color}
      `}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>

      {/* Event content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Event type badge */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-soft font-semibold capitalize
                ${bgColor} ${color}
              `}>
                {event.type.replace(/_/g, ' ')}
              </span>
              {isRealtime && (
                <motion.span
                  className="px-2 py-0.5 rounded-full text-xs font-soft font-semibold bg-[var(--bento-primary)] text-white"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  New!
                </motion.span>
              )}
            </div>

            {/* Event text */}
            <p className="text-[var(--bento-text)] font-soft text-sm md:text-base leading-relaxed">
              {event.text}
            </p>
          </div>

          {/* Timestamp */}
          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-soft font-medium text-[var(--bento-primary)]">
              {formatRelativeTime(event.createdAt)}
            </p>
            <p className="text-xs text-[var(--bento-text-muted)] mt-0.5 hidden sm:block">
              {formatFullDate(event.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline connector line (for visual continuity) */}
      <div className="absolute left-7 md:left-8 top-full w-0.5 h-4 bg-gradient-to-b from-[var(--bento-border)] to-transparent" />
    </motion.div>
  );
}

// Content card wrapper
function ContentCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      bg-[var(--bento-card)]/80 backdrop-blur-sm border border-[var(--bento-primary)]/10
      rounded-2xl p-6 md:p-8 shadow-lg shadow-[var(--bento-primary)]/5 ${className}
    `}>
      {children}
    </div>
  );
}

export function Chronicle() {
  const [showRealtimeEvents, setShowRealtimeEvents] = useState(true);
  const { status, realtimeEvents, reconnect, clearRealtimeEvents } = useEventsHub();

  // Fetch historical events with infinite scroll
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['chronicle-events'],
    queryFn: ({ pageParam }) => eventsApi.getEvents({ cursor: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Flatten all pages of historical events
  const historicalEvents = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.events);
  }, [data]);

  // Create a Set of realtime event keys to filter duplicates from historical
  const realtimeEventKeys = useMemo(() => {
    return new Set(realtimeEvents.map(getEventKey));
  }, [realtimeEvents]);

  // Filter historical events to exclude any that are also in realtime
  const filteredHistoricalEvents = useMemo(() => {
    return historicalEvents.filter((event) => !realtimeEventKeys.has(getEventKey(event)));
  }, [historicalEvents, realtimeEventKeys]);

  // Total event count
  const totalCount = realtimeEvents.length + filteredHistoricalEvents.length;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      <FloatingBackgroundMoogles />
      <FloatingSparkles />

      <div className="relative py-8 md:py-12 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <motion.header 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Decorative opener */}
            <motion.p
              className="font-accent text-xl md:text-2xl text-[var(--bento-secondary)] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              ~ The story of our adventures ~
            </motion.p>

            <div className="flex items-center justify-center gap-3 mb-4">
              <Scroll className="w-5 h-5 text-[var(--bento-primary)]" />
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bento-primary)]/10 border border-[var(--bento-primary)]/20 text-[var(--bento-primary)] text-sm font-soft font-medium">
                <Clock className="w-4 h-4" />
                {totalCount} events
              </span>
              <Scroll className="w-5 h-5 text-[var(--bento-primary)]" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3">
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                The Chronicle
              </span>
            </h1>

            <p className="text-lg text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2 mb-4">
              Every tale from our FC, unfolding in real-time
              <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </p>

            <StoryDivider className="mx-auto" />
          </motion.header>

          {/* Controls bar */}
          <motion.div
            className="flex flex-wrap items-center justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ConnectionIndicator status={status} />

            <div className="flex items-center gap-3">
              {/* Toggle realtime events visibility */}
              {realtimeEvents.length > 0 && (
                <button
                  onClick={() => setShowRealtimeEvents(!showRealtimeEvents)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-soft font-medium
                    transition-all cursor-pointer
                    ${showRealtimeEvents 
                      ? 'bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] border border-[var(--bento-primary)]/20' 
                      : 'bg-[var(--bento-card)] text-[var(--bento-text-muted)] border border-[var(--bento-border)]'
                    }
                  `}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {realtimeEvents.length} new
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRealtimeEvents ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* Clear realtime events */}
              {realtimeEvents.length > 0 && (
                <button
                  onClick={clearRealtimeEvents}
                  className="px-3 py-1.5 rounded-full text-sm font-soft font-medium text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)] bg-[var(--bento-card)] border border-[var(--bento-border)] hover:border-[var(--bento-primary)]/20 transition-all cursor-pointer"
                >
                  Clear new
                </button>
              )}

              {/* Refresh button */}
              <motion.button
                onClick={() => refetch()}
                className="p-2 rounded-full bg-[var(--bento-card)] border border-[var(--bento-border)] text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)] hover:border-[var(--bento-primary)]/20 transition-all cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </motion.button>

              {/* Reconnect button (only if disconnected/error) */}
              {(status === 'disconnected' || status === 'error') && (
                <motion.button
                  onClick={reconnect}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-soft font-medium bg-[var(--bento-primary)] text-white hover:bg-[var(--bento-primary)]/90 transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Wifi className="w-3.5 h-3.5" />
                  Reconnect
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Events timeline */}
          {isLoading && historicalEvents.length === 0 ? (
            <ContentCard className="text-center py-16">
              <motion.img 
                src={flyingMoogles} 
                alt="Moogles flying" 
                className="w-40 md:w-52 mx-auto mb-4"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.p 
                className="font-accent text-2xl text-[var(--bento-text-muted)]"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Gathering the chronicles, kupo...
              </motion.p>
            </ContentCard>
          ) : isError ? (
            <ContentCard className="text-center py-12 md:py-16">
              <img 
                src={deadMoogle} 
                alt="Moogle down" 
                className="w-40 h-40 mx-auto mb-5 object-contain"
              />
              <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">
                Something went wrong
              </p>
              <p className="font-accent text-2xl text-[var(--bento-text-muted)] mb-6">
                The chronicle tome got lost, kupo...
              </p>
              <motion.button
                onClick={() => refetch()}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="
                  inline-flex items-center justify-center gap-2
                  px-6 py-3 rounded-xl
                  bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]
                  text-white font-soft font-semibold
                  shadow-lg shadow-[var(--bento-primary)]/25
                  hover:shadow-xl hover:shadow-[var(--bento-primary)]/30
                  transition-all cursor-pointer
                "
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </motion.button>
            </ContentCard>
          ) : totalCount === 0 ? (
            <ContentCard className="text-center py-12 md:py-16">
              <img 
                src={moogleMail} 
                alt="Moogle with mail" 
                className="w-40 h-40 mx-auto mb-5 object-contain"
              />
              <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">
                No events yet
              </p>
              <p className="font-accent text-2xl text-[var(--bento-text-muted)]">
                The chronicle awaits its first entry, kupo~
              </p>
            </ContentCard>
          ) : (
            <div className="space-y-4">
              {/* Realtime events section */}
              <AnimatePresence>
                {showRealtimeEvents && realtimeEvents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 px-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[var(--bento-primary)]"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm font-soft font-semibold text-[var(--bento-primary)]">
                        Live Updates
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-[var(--bento-primary)]/30 to-transparent" />
                    </div>
                    
                    {realtimeEvents.map((event) => (
                      <TimelineEventCard 
                        key={`rt-${getEventKey(event)}`} 
                        event={event} 
                        isRealtime 
                      />
                    ))}

                    <div className="flex items-center gap-3 px-2 pt-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-border)] to-transparent" />
                      <span className="text-xs font-soft text-[var(--bento-text-muted)]">
                        Earlier events
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-border)] to-transparent" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Historical events */}
              {filteredHistoricalEvents.map((event) => (
                <TimelineEventCard 
                  key={`hist-${getEventKey(event)}`} 
                  event={event} 
                />
              ))}

              {/* Load more button */}
              {hasNextPage && (
                <motion.div 
                  className="text-center pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.button
                    onClick={handleLoadMore}
                    disabled={isFetchingNextPage}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                      inline-flex items-center justify-center gap-2
                      px-6 py-3 rounded-xl
                      bg-[var(--bento-card)] border border-[var(--bento-primary)]/20
                      text-[var(--bento-primary)] font-soft font-semibold
                      hover:bg-[var(--bento-primary)]/5 hover:border-[var(--bento-primary)]/30
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all cursor-pointer
                    "
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Load more events
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}

          {/* Footer */}
          {!isLoading && !isError && totalCount > 0 && (
            <footer className="text-center mt-16 pt-8" style={{ paddingBottom: 'calc(2rem + var(--safe-area-inset-bottom, 0px))' }}>
              <StoryDivider className="mx-auto mb-6" />
              <p className="font-accent text-xl text-[var(--bento-text-muted)] flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                Every moment tells a story, kupo!
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
              </p>
              <p className="font-accent text-lg text-[var(--bento-secondary)] mt-2">
                ~ to be continued ~
              </p>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
