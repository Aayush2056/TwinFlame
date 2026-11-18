import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Heart,
  MapPin,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MatchModal } from '../components/discover/MatchModal.jsx';
import { SwipeCard } from '../components/discover/SwipeCard.jsx';
import { useDiscoveryContext } from '../context/DiscoveryContext.jsx';
import { useDiscoveryFeed } from '../hooks/useDiscoveryFeed.js';

export function DiscoverPage() {
  const navigate = useNavigate();
  const { handleResetDemo } = useDiscoveryContext();
  const {
    activeProfile,
    nextProfile,
    totalRemaining,
    totalCatalog,
    totalSwiped,
    isLoading,
    isSubmitting,
    errorMessage,
    swipeFeedback,
    exitDirection,
    activeMatch,
    setActiveMatch,
    loadInitialFeed,
    handleSwipe,
  } = useDiscoveryFeed();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
      {/* Error Alert Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => void loadInitialFeed()}
            className="min-h-[36px] shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 items-center">
          <div className="lg:col-span-6 xl:col-span-5 mx-auto w-full max-w-[410px]">
            <div className="aspect-[3/4] w-full animate-pulse rounded-3xl bg-stone-200" />
            <div className="mt-5 flex items-center justify-center gap-6">
              <div className="h-14 w-14 animate-pulse rounded-full bg-stone-200" />
              <div className="h-14 w-14 animate-pulse rounded-full bg-stone-200" />
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-6 xl:col-span-7">
            <div className="h-80 w-full animate-pulse rounded-3xl bg-stone-200/70" />
          </div>
        </div>
      ) : !activeProfile ? (
        /* Empty State */
        <div className="mx-auto flex min-h-[62dvh] max-w-lg flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Sparkles className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-zinc-900">
            You&apos;ve seen everyone nearby
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            You&apos;ve reviewed all {totalCatalog} profiles in the current discovery deck. Check your mutual matches or reset the demo deck to swipe again.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row w-full gap-3">
            <button
              type="button"
              onClick={() => navigate('/matches')}
              className="min-h-[48px] flex-1 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700 cursor-pointer"
            >
              View Matches
            </button>
            <button
              type="button"
              onClick={() => void handleResetDemo()}
              className="min-h-[48px] flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-stone-100 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Start Fresh Demo</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Discovery Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 items-start">
          {/* Card Deck Column */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[400px] aspect-[3/4] max-h-[calc(100dvh-230px)] sm:max-h-[540px]">
              {nextProfile && (
                <SwipeCard
                  key={`next-${nextProfile.id}`}
                  profile={nextProfile}
                  isTopCard={false}
                  exitDirection={null}
                  onSwipe={() => {}}
                />
              )}

              <AnimatePresence mode="popLayout">
                <SwipeCard
                  key={activeProfile.id}
                  profile={activeProfile}
                  isTopCard={true}
                  exitDirection={exitDirection}
                  onSwipe={(action) => void handleSwipe(action)}
                  disabled={isSubmitting}
                />
              </AnimatePresence>
            </div>

            {/* Action Feedback + Tactile Pass / Like Controls */}
            <div className="mt-4 sm:mt-5 flex w-full max-w-[400px] items-center justify-between px-4">
              <button
                type="button"
                onClick={() => void handleSwipe('pass')}
                disabled={isSubmitting}
                aria-label={`Pass on ${activeProfile.name}`}
                className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-stone-300 bg-white text-zinc-700 shadow-sm transition-transform hover:scale-105 hover:border-zinc-400 hover:text-zinc-900 active:scale-95 disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700"
              >
                <X className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} aria-hidden="true" />
              </button>

              <div className="min-h-[24px] text-center">
                {swipeFeedback ? (
                  <span
                    className={`text-xs font-semibold ${
                      swipeFeedback.action === 'like'
                        ? 'text-emerald-700'
                        : 'text-zinc-600'
                    }`}
                  >
                    {swipeFeedback.action === 'like' ? 'Liked' : 'Passed on'}{' '}
                    {swipeFeedback.name}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-zinc-500 tabular-nums">
                    {totalRemaining} remaining
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => void handleSwipe('like')}
                disabled={isSubmitting}
                aria-label={`Like ${activeProfile.name}`}
                className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-rose-600 text-white shadow-md shadow-rose-600/20 transition-transform hover:scale-105 hover:bg-rose-700 active:scale-95 disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                <Heart className="h-6 w-6 sm:h-7 sm:w-7 fill-white" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Desktop Editorial Profile Dossier Panel */}
          <aside className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col rounded-3xl border border-stone-200 bg-white p-8 shadow-xs">
            <div className="flex items-baseline justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-900">
                  {activeProfile.name},{' '}
                  <span className="font-sans font-normal text-zinc-600 tabular-nums">
                    {activeProfile.age}
                  </span>
                </h1>
                <div className="mt-2 flex items-center gap-3 text-sm text-zinc-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                    <span>{activeProfile.city}</span>
                  </span>
                  <span aria-hidden="true" className="text-stone-300">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                    <span>{activeProfile.college}</span>
                  </span>
                </div>
              </div>

              <span className="text-xs font-medium text-zinc-500 tabular-nums whitespace-nowrap shrink-0">
                {totalSwiped} of {totalCatalog} reviewed
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-xs font-semibold tracking-wide text-zinc-500">
                About
              </h2>
              <p className="mt-2 text-base leading-relaxed text-zinc-800">
                {activeProfile.bio}
              </p>
            </div>

            <div className="mt-6 border-t border-stone-100 pt-6">
              <h2 className="text-xs font-semibold tracking-wide text-zinc-500">
                Interests
              </h2>
              <p className="mt-2 text-sm font-medium text-zinc-800 leading-relaxed">
                {activeProfile.interests.join(' · ')}
              </p>
            </div>

            <div className="mt-8 border-t border-stone-100 pt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Left arrow to Pass</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Right arrow to Like</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleSwipe('pass')}
                  disabled={isSubmitting}
                  className="min-h-[44px] rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-stone-100 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                  Pass
                </button>
                <button
                  type="button"
                  onClick={() => void handleSwipe('like')}
                  disabled={isSubmitting}
                  className="min-h-[44px] rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                  Like {activeProfile.name}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <MatchModal
        match={activeMatch}
        onClose={() => setActiveMatch(null)}
        onViewMatches={() => {
          setActiveMatch(null);
          navigate('/matches');
        }}
      />
    </div>
  );
}
