import { useCallback, useEffect, useRef, useState } from 'react';
import { useDiscoveryContext } from '../context/DiscoveryContext.jsx';
import { fetchFeed, submitSwipe } from '../services/discoveryApi.js';
import { extractErrorMessage } from '../utils/formatters.js';

export function useDiscoveryFeed() {
  const { resetVersion, syncMatchCount } = useDiscoveryContext();

  const [profiles, setProfiles] = useState([]);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [totalCatalog, setTotalCatalog] = useState(32);
  const [totalSwiped, setTotalSwiped] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [swipeFeedback, setSwipeFeedback] = useState(null);

  const [exitDirection, setExitDirection] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);

  const feedbackTimerRef = useRef(null);
  const submittingRef = useRef(false);

  const loadInitialFeed = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchFeed(1, 12);

      setProfiles(data.profiles);
      setTotalRemaining(data.pagination.totalRemaining);
      setHasMore(data.pagination.hasMore);
      setTotalSwiped(data.stats.totalSwiped);
      setTotalCatalog(data.stats.totalCatalog);
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitialFeed();
  }, [loadInitialFeed, resetVersion]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const replenishQueue = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);

    try {
      const data = await fetchFeed(1, 12);

      setProfiles((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const fresh = data.profiles.filter((p) => !existingIds.has(p.id));

        return [...prev, ...fresh];
      });

      setTotalRemaining(data.pagination.totalRemaining);
      setHasMore(data.pagination.hasMore);
    } catch {
      // Background prefetch failure
    } finally {
      setIsFetchingMore(false);
    }
  }, [hasMore, isFetchingMore]);

  const showTransientFeedback = useCallback((action, name) => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    setSwipeFeedback({ action, name });

    feedbackTimerRef.current = window.setTimeout(() => {
      setSwipeFeedback(null);
    }, 1500);
  }, []);

  const activeProfile = profiles[0] ?? null;
  const nextProfile = profiles[1] ?? null;

  const handleSwipe = useCallback(
    async (action) => {
      if (!activeProfile || submittingRef.current || activeMatch) return;

      submittingRef.current = true;
      setIsSubmitting(true);
      setErrorMessage(null);

      const target = activeProfile;
      const previousProfiles = profiles;

      // Optimistic update: UI immediately removes the card.
      setExitDirection(action);
      setProfiles((prev) => prev.filter((p) => p.id !== target.id));
      setTotalRemaining((prev) => Math.max(0, prev - 1));
      setTotalSwiped((prev) => prev + 1);

      showTransientFeedback(action, target.name);

      try {
        const result = await submitSwipe(target.id, action);

        if (result.isMatch && result.match) {
          setActiveMatch(result.match);
          void syncMatchCount();
        }
      } catch (err) {
        // Rollback if backend request fails.
        setProfiles((prev) => {
          if (prev.some((p) => p.id === target.id)) return prev;
          return [...previousProfiles];
        });

        setTotalRemaining((prev) => prev + 1);
        setTotalSwiped((prev) => Math.max(0, prev - 1));

        setExitDirection(null);
        setSwipeFeedback(null);
        setErrorMessage(extractErrorMessage(err));
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }

      if (profiles.length <= 4 && hasMore) {
        void replenishQueue();
      }
    },
    [
      activeMatch,
      activeProfile,
      hasMore,
      profiles,
      replenishQueue,
      showTransientFeedback,
      syncMatchCount,
    ]
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (activeMatch || isLoading || !activeProfile) return;

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        void handleSwipe('pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        void handleSwipe('like');
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeMatch, activeProfile, handleSwipe, isLoading]);

  return {
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
  };
}