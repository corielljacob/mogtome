import { useState, useMemo, useCallback, useEffect, useRef, memo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Heart,
  ChevronDown,
  Sparkles,
  Loader2,
  ChevronUp,
} from 'lucide-react';

// Shared components
import { StoryDivider, FloatingSparkles, ContentCard, SimpleFloatingMoogles, MobileHeader } from '../components';

// Utils & Constants
import { formatRelativeTime, formatFullDate } from '../utils';
import { getEventTypeConfig } from '../constants';

// API & Hooks
import { eventsApi } from '../api/events';
import { useEventsHub, type ConnectionStatus } from '../hooks';
import type { ChronicleEvent } from '../types';

// Assets
import flyingMoogles from '../assets/moogles/moogles flying.webp';
import moogleMail from '../assets/moogles/moogle mail.webp';
import deadMoogle from '../assets/moogles/dead moogle.webp';

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

const PLACEHOLDER_TIMESTAMP = 0;
const PLACEHOLDER_CREATION_TIME = '1970-01-01T00:00:00Z';

function hasValidId(event: ChronicleEvent): boolean {
  return event.id.timestamp !== PLACEHOLDER_TIMESTAMP || event.id.creationTime !== PLACEHOLDER_CREATION_TIME;
}

function getEventSignature(event: ChronicleEvent): string {
  return `${event.createdAt}-${event.type}-${event.text}`;
}

function getEventKey(event: ChronicleEvent, index: number): string {
  if (hasValidId(event)) return `${event.id.timestamp}-${event.id.creationTime}`;
  return `${getEventSignature(event)}-${index}`;
}

/** Group events by date */
function groupEventsByDate(events: ChronicleEvent[]): Map<string, ChronicleEvent[]> {
  const groups = new Map<string, ChronicleEvent[]>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  events.forEach(event => {
    const eventDate = new Date(event.createdAt);
    eventDate.setHours(0, 0, 0, 0);
    
    let dateKey: string;
    if (eventDate.getTime() === today.getTime()) {
      dateKey = 'Today';
    } else if (eventDate.getTime() === yesterday.getTime()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
    
    if (!groups.has(dateKey)) groups.set(dateKey, []);
    groups.get(dateKey)!.push(event);
  });
  
  return groups;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Connection status indicator */
const ConnectionIndicator = memo(function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  const statusConfig: Record<ConnectionStatus, { color: string; label: string; Icon: typeof Wifi }> = {
    connected: { color: 'text-green-500', label: 'Live', Icon: Wifi },
    connecting: { color: 'text-yellow-500', label: 'Connecting...', Icon: Wifi },
    reconnecting: { color: 'text-yellow-500', label: 'Reconnecting...', Icon: Wifi },
    disconnected: { color: 'text-[var(--bento-text-muted)]', label: 'Offline', Icon: WifiOff },
    error: { color: 'text-red-500', label: 'Error', Icon: WifiOff },
  };

  const { color, label, Icon } = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bento-card)]/80 border border-[var(--bento-border)] ${color} ${status === 'connecting' || status === 'reconnecting' ? 'animate-pulse' : ''}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-soft font-medium">{label}</span>
      {status === 'connected' && <span className="w-2 h-2 rounded-full bg-green-500 animate-ping-slow" />}
    </div>
  );
});

/** Mobile: Premium compact connection pill */
const MobileConnectionPill = memo(function MobileConnectionPill({ status }: { status: ConnectionStatus }) {
  const configs: Record<ConnectionStatus, { bg: string; text: string; label: string; glow?: string }> = {
    connected: { bg: 'bg-green-500/15', text: 'text-green-600', label: 'Live', glow: 'rgba(34, 197, 94, 0.2)' },
    connecting: { bg: 'bg-yellow-500/15', text: 'text-yellow-600', label: 'Connecting...' },
    reconnecting: { bg: 'bg-yellow-500/15', text: 'text-yellow-600', label: 'Reconnecting...' },
    disconnected: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Offline' },
    error: { bg: 'bg-red-500/15', text: 'text-red-500', label: 'Error' },
  };
  
  const config = configs[status];
  const Icon = status === 'disconnected' || status === 'error' ? WifiOff : Wifi;
  const isPulsing = status === 'connecting' || status === 'reconnecting';
  
  return (
    <motion.div 
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} ${config.text}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isPulsing ? [0.7, 1, 0.7] : 1, 
        scale: 1,
      }}
      transition={isPulsing ? { duration: 1.5, repeat: Infinity } : { duration: 0.2 }}
      style={config.glow ? { boxShadow: `0 0 12px ${config.glow}` } : undefined}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[11px] font-bold">{config.label}</span>
      {status === 'connected' && (
        <motion.span 
          className="w-2 h-2 rounded-full bg-green-500"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
});

/** Mobile: Premium date section header */
function MobileDateHeader({ date }: { date: string }) {
  return (
    <motion.div 
      className="sticky top-11 z-20 -mx-3 px-4 py-3 bg-[var(--bento-card)]/90"
      style={{
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        backdropFilter: 'saturate(180%) blur(16px)',
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-bold text-[var(--bento-text)] tracking-tight">
          {date}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[var(--bento-border)]/50 to-transparent" />
      </div>
    </motion.div>
  );
}

/** Mobile: Premium native-style event card */
const MobileEventCard = memo(function MobileEventCard({ event, isNew = false, index = 0 }: { event: ChronicleEvent; isNew?: boolean; index?: number }) {
  const { Icon, color, bgColor, label } = getEventTypeConfig(event.type);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay: Math.min(index * 0.03, 0.3),
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative flex items-start gap-3.5 p-4
        bg-[var(--bento-card)] rounded-[18px]
        border border-[var(--bento-border)]/40
        active:bg-[var(--bento-bg)] transition-colors duration-75
        ${isNew ? 'border-[var(--bento-primary)]/40' : ''}
      `}
      style={{
        boxShadow: isNew 
          ? '0 4px 16px rgba(229, 75, 75, 0.1), 0 2px 4px rgba(0,0,0,0.02)'
          : '0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)',
      }}
    >
      {/* New event glow */}
      {isNew && (
        <motion.div 
          className="absolute inset-0 rounded-[18px] bg-[var(--bento-primary)]/[0.03] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Icon with gradient background */}
      <motion.div 
        className={`relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${bgColor}`}
        initial={isNew ? { scale: 0.8 } : false}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        <Icon className={`w-5 h-5 ${color}`} />
        {isNew && (
          <motion.div 
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--bento-primary)] border-2 border-[var(--bento-card)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
          />
        )}
      </motion.div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${color}`}>{label}</span>
          </div>
          <span className="text-[11px] text-[var(--bento-text-muted)] font-medium">
            {formatRelativeTime(event.createdAt)}
          </span>
        </div>
        
        {/* Event text */}
        <p className="text-[15px] text-[var(--bento-text)] leading-relaxed">
          {event.text}
        </p>
      </div>
    </motion.div>
  );
});

/** Desktop: Timeline event card */
const TimelineEventCard = memo(function TimelineEventCard({ event, isRealtime = false }: { event: ChronicleEvent; isRealtime?: boolean }) {
  const { Icon, color, bgColor, label } = getEventTypeConfig(event.type);
  
  return (
    <motion.div
      initial={isRealtime ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative flex gap-4 p-4 md:p-5 bg-[var(--bento-card)]/80 backdrop-blur-sm border border-[var(--bento-border)] rounded-2xl shadow-sm hover:shadow-md hover:border-[var(--bento-primary)]/20 transition-all duration-200 ${isRealtime ? 'ring-2 ring-[var(--bento-primary)]/30 ring-offset-2 ring-offset-[var(--bento-bg)]' : ''}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${bgColor} ${color}`}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded-full text-xs font-soft font-semibold ${bgColor} ${color}`}>{label}</span>
              {isRealtime && <motion.span className="px-2 py-0.5 rounded-full text-xs font-soft font-semibold bg-[var(--bento-primary)] text-white" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>New!</motion.span>}
            </div>
            <p className="text-[var(--bento-text)] font-soft text-sm md:text-base leading-relaxed">{event.text}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-soft font-medium text-[var(--bento-primary)]">{formatRelativeTime(event.createdAt)}</p>
            <p className="text-xs text-[var(--bento-text-muted)] mt-0.5">{formatFullDate(event.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className="absolute left-7 md:left-8 top-full w-0.5 h-4 bg-gradient-to-b from-[var(--bento-border)] to-transparent" />
    </motion.div>
  );
});

/** Premium floating back-to-top button */
function BackToTopButton({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 z-40 md:hidden w-12 h-12 rounded-full bg-[var(--bento-card)]/95 border border-[var(--bento-border)]/50 flex items-center justify-center cursor-pointer"
          whileTap={{ scale: 0.9 }}
          style={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
            WebkitBackdropFilter: 'blur(12px)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronUp className="w-5 h-5 text-[var(--bento-primary)]" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Chronicle() {
  const [showRealtimeEvents, setShowRealtimeEvents] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { status, realtimeEvents, unseenCount, reconnect, markAllAsSeen, clearEvents } = useEventsHub();
  const hasInitialLoadRef = useRef(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data, dataUpdatedAt, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['chronicle-events'],
    queryFn: ({ pageParam }) => eventsApi.getEvents({ cursor: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    if (!hasInitialLoadRef.current && data) {
      hasInitialLoadRef.current = true;
    } else if (hasInitialLoadRef.current && dataUpdatedAt) {
      clearEvents();
    }
  }, [dataUpdatedAt, clearEvents]);

  const historicalEvents = useMemo(() => data?.pages?.flatMap((page) => page.events) ?? [], [data]);
  const realtimeEventSignatures = useMemo(() => new Set(realtimeEvents.map(getEventSignature)), [realtimeEvents]);
  const filteredHistoricalEvents = useMemo(() => historicalEvents.filter((event) => !realtimeEventSignatures.has(getEventSignature(event))), [historicalEvents, realtimeEventSignatures]);
  const groupedEvents = useMemo(() => groupEventsByDate(filteredHistoricalEvents), [filteredHistoricalEvents]);
  const totalCount = realtimeEvents.length + filteredHistoricalEvents.length;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen relative">
      {/* Desktop: Background decorations */}
      <div className="hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
        <SimpleFloatingMoogles primarySrc={flyingMoogles} secondarySrc={moogleMail} />
        <FloatingSparkles minimal />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE VIEW (< md breakpoint)
          Award-winning header with gradient accent + controls
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Page header with controls */}
        <MobileHeader 
          title="Chronicle"
          rightContent={<MobileConnectionPill status={status} />}
        >
          {/* Control buttons - only show row if there's something to display */}
          {(realtimeEvents.length > 0 || unseenCount > 0 || status === 'disconnected' || status === 'error') && (
            <div className="flex items-center gap-2 px-5 pb-4">
              {/* Live events toggle */}
              {realtimeEvents.length > 0 && (
                <motion.button 
                  onClick={() => setShowRealtimeEvents(!showRealtimeEvents)} 
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all ${
                    showRealtimeEvents 
                      ? 'bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-accent)] text-white shadow-lg shadow-[var(--bento-primary)]/30' 
                      : 'bg-[var(--bento-card)] text-[var(--bento-text)] border border-[var(--bento-border)]/50'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-4 h-4" />
                  {unseenCount > 0 ? `${unseenCount} new` : `${realtimeEvents.length} live`}
                </motion.button>
              )}
              
              {/* Mark as read */}
              {unseenCount > 0 && (
                <motion.button 
                  onClick={markAllAsSeen} 
                  className="px-4 py-2.5 rounded-2xl text-[13px] font-semibold text-[var(--bento-text-muted)]"
                  whileTap={{ scale: 0.95 }}
                >
                  Mark read
                </motion.button>
              )}
              
              {/* Reconnect button */}
              {(status === 'disconnected' || status === 'error') && (
                <motion.button 
                  onClick={reconnect} 
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-bold bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-accent)] text-white shadow-lg shadow-[var(--bento-primary)]/30 ml-auto" 
                  whileTap={{ scale: 0.95 }}
                >
                  <Wifi className="w-4 h-4" />
                  Reconnect
                </motion.button>
              )}
            </div>
          )}
        </MobileHeader>

        <div className="px-3 py-2 pb-24">
          {isLoading && historicalEvents.length === 0 ? (
            <ContentCard className="text-center py-16 mt-4">
              <motion.img src={flyingMoogles} alt="Moogles flying" className="w-32 mx-auto mb-4" animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              <motion.p className="font-accent text-xl text-[var(--bento-text-muted)]" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>Gathering chronicles, kupo...</motion.p>
            </ContentCard>
          ) : isError ? (
            <ContentCard className="text-center py-12 mt-4">
              <img src={deadMoogle} alt="Moogle down" className="w-32 h-32 mx-auto mb-4 object-contain" />
              <p className="text-lg font-display font-semibold mb-1 text-[var(--bento-text)]">Something went wrong</p>
              <p className="font-accent text-lg text-[var(--bento-text-muted)] mb-5">The tome got lost, kupo...</p>
              <motion.button onClick={() => refetch()} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bento-primary)] text-white font-soft font-semibold text-sm shadow-lg shadow-[var(--bento-primary)]/25 active:brightness-95 transition-all cursor-pointer"><RefreshCw className="w-4 h-4" />Try Again</motion.button>
            </ContentCard>
          ) : totalCount === 0 ? (
            <ContentCard className="text-center py-12 mt-4">
              <img src={moogleMail} alt="Moogle with mail" className="w-32 h-32 mx-auto mb-4 object-contain" />
              <p className="text-lg font-display font-semibold mb-1 text-[var(--bento-text)]">No events yet</p>
              <p className="font-accent text-lg text-[var(--bento-text-muted)]">Awaiting the first entry, kupo~</p>
            </ContentCard>
          ) : (
            <div className="pt-2 space-y-2">
              <AnimatePresence>
                {showRealtimeEvents && realtimeEvents.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                    <div className="flex items-center gap-2 px-1 py-2">
                      <motion.div className="w-2 h-2 rounded-full bg-[var(--bento-primary)]" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                      <span className="text-xs font-soft font-bold text-[var(--bento-primary)] uppercase tracking-wider">Live</span>
                    </div>
                    {realtimeEvents.map((event, index) => <MobileEventCard key={`rt-${getEventKey(event, index)}`} event={event} isNew={index < unseenCount} index={index} />)}
                    <div className="flex items-center gap-2 py-3">
                      <div className="flex-1 h-px bg-[var(--bento-border)]" />
                      <span className="text-[10px] font-soft text-[var(--bento-text-muted)] uppercase">Earlier</span>
                      <div className="flex-1 h-px bg-[var(--bento-border)]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {Array.from(groupedEvents.entries()).map(([date, events]) => (
                <div key={date}>
                  <MobileDateHeader date={date} />
                  <div className="space-y-2.5">{events.map((event, index) => <MobileEventCard key={`hist-${getEventKey(event, index)}`} event={event} index={index} />)}</div>
                </div>
              ))}
              {hasNextPage && (
                <motion.div className="text-center pt-4 pb-2">
                  <motion.button onClick={handleLoadMore} disabled={isFetchingNextPage} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bento-card)] border border-[var(--bento-border)] text-[var(--bento-text)] font-soft font-medium text-sm disabled:opacity-50 active:bg-[var(--bento-bg)] transition-all cursor-pointer">
                    {isFetchingNextPage ? <><Loader2 className="w-4 h-4 animate-spin" />Loading...</> : <><ChevronDown className="w-4 h-4" />Load more</>}
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}
        </div>
        <BackToTopButton show={isScrolled && !isLoading && totalCount > 0} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          DESKTOP VIEW (>= md breakpoint)
          Original storybook timeline design
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative py-8 md:py-12 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <motion.header className="text-center mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <motion.p className="font-accent text-xl md:text-2xl text-[var(--bento-secondary)] mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>~ The story of our adventures ~</motion.p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3">
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">The Chronicle</span>
            </h1>
            <p className="text-lg text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2 mb-4">
              Every tale from our FC, unfolding in real-time
              <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </p>
            <StoryDivider className="mx-auto" size="sm" />
          </motion.header>

          <motion.div className="flex flex-wrap items-center justify-between gap-4 mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ConnectionIndicator status={status} />
            <div className="flex items-center gap-3">
              {realtimeEvents.length > 0 && (
                <button onClick={() => setShowRealtimeEvents(!showRealtimeEvents)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-soft font-medium transition-all cursor-pointer ${showRealtimeEvents ? 'bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] border border-[var(--bento-primary)]/20' : 'bg-[var(--bento-card)] text-[var(--bento-text-muted)] border border-[var(--bento-border)]'}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {unseenCount > 0 ? `${unseenCount} new` : `${realtimeEvents.length} live`}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRealtimeEvents ? 'rotate-180' : ''}`} />
                </button>
              )}
              {unseenCount > 0 && <button onClick={markAllAsSeen} className="px-3 py-1.5 rounded-full text-sm font-soft font-medium text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)] bg-[var(--bento-card)] border border-[var(--bento-border)] hover:border-[var(--bento-primary)]/20 transition-all cursor-pointer">Mark as read</button>}
              {(status === 'disconnected' || status === 'error') && <motion.button onClick={reconnect} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-soft font-medium bg-[var(--bento-primary)] text-white hover:bg-[var(--bento-primary)]/90 transition-all cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><Wifi className="w-3.5 h-3.5" />Reconnect</motion.button>}
            </div>
          </motion.div>

          {isLoading && historicalEvents.length === 0 ? (
            <ContentCard className="text-center py-16">
              <motion.img src={flyingMoogles} alt="Moogles flying" className="w-40 md:w-52 mx-auto mb-4" animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              <motion.p className="font-accent text-2xl text-[var(--bento-text-muted)]" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>Gathering the chronicles, kupo...</motion.p>
            </ContentCard>
          ) : isError ? (
            <ContentCard className="text-center py-12 md:py-16">
              <img src={deadMoogle} alt="Moogle down" className="w-40 h-40 mx-auto mb-5 object-contain" />
              <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">Something went wrong</p>
              <p className="font-accent text-2xl text-[var(--bento-text-muted)] mb-6">The chronicle tome got lost, kupo...</p>
              <motion.button onClick={() => refetch()} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white font-soft font-semibold shadow-lg shadow-[var(--bento-primary)]/25 hover:shadow-xl hover:shadow-[var(--bento-primary)]/30 transition-all cursor-pointer"><RefreshCw className="w-4 h-4" />Try Again</motion.button>
            </ContentCard>
          ) : totalCount === 0 ? (
            <ContentCard className="text-center py-12 md:py-16">
              <img src={moogleMail} alt="Moogle with mail" className="w-40 h-40 mx-auto mb-5 object-contain" />
              <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">No events yet</p>
              <p className="font-accent text-2xl text-[var(--bento-text-muted)]">The chronicle awaits its first entry, kupo~</p>
            </ContentCard>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {showRealtimeEvents && realtimeEvents.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <motion.div className="w-2 h-2 rounded-full bg-[var(--bento-primary)]" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                      <span className="text-sm font-soft font-semibold text-[var(--bento-primary)]">Live Updates</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-[var(--bento-primary)]/30 to-transparent" />
                    </div>
                    {realtimeEvents.map((event, index) => <TimelineEventCard key={`rt-${getEventKey(event, index)}`} event={event} isRealtime={index < unseenCount} />)}
                    <div className="flex items-center gap-3 px-2 pt-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-border)] to-transparent" />
                      <span className="text-xs font-soft text-[var(--bento-text-muted)]">Earlier events</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-border)] to-transparent" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {filteredHistoricalEvents.map((event, index) => <TimelineEventCard key={`hist-${getEventKey(event, index)}`} event={event} />)}
              {hasNextPage && (
                <motion.div className="text-center pt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.button onClick={handleLoadMore} disabled={isFetchingNextPage} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--bento-card)] border border-[var(--bento-primary)]/20 text-[var(--bento-primary)] font-soft font-semibold hover:bg-[var(--bento-primary)]/5 hover:border-[var(--bento-primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer">
                    {isFetchingNextPage ? <><Loader2 className="w-4 h-4 animate-spin" />Loading more...</> : <><ChevronDown className="w-4 h-4" />Load more events</>}
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}

          {!isLoading && !isError && totalCount > 0 && (
            <footer className="text-center mt-16 pt-8" style={{ paddingBottom: 'calc(2rem + var(--safe-area-inset-bottom, 0px))' }}>
              <StoryDivider className="mx-auto mb-6" size="sm" />
              <p className="font-accent text-xl text-[var(--bento-text-muted)] flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                Every moment tells a story, kupo!
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
              </p>
              <p className="font-accent text-lg text-[var(--bento-secondary)] mt-2">~ to be continued ~</p>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
