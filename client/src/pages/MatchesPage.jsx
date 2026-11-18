import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MatchCard } from '../components/matches/MatchCard.jsx';
import { MatchDetailModal } from '../components/matches/MatchDetailModal.jsx';
import { useDiscoveryContext } from '../context/DiscoveryContext.jsx';
import { fetchMatches } from '../services/discoveryApi.js';
import { extractErrorMessage } from '../utils/formatters.js';

export function MatchesPage() {
  const { setMatchCount, resetVersion } = useDiscoveryContext();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const loadMatches = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchMatches();
      setMatches(data.matches);
      setMatchCount(data.total);
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [setMatchCount]);

  useEffect(() => {
    void loadMatches();
  }, [loadMatches, resetVersion]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
            Matches
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600">
            Mutual connections only. One-sided likes remain completely private.
          </p>
        </div>

        <span className="text-sm font-medium text-zinc-600 tabular-nums">
          {matches.length} mutual {matches.length === 1 ? 'match' : 'matches'}
        </span>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => void loadMatches()}
            className="min-h-[36px] shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="h-96 animate-pulse rounded-3xl bg-stone-200"
            />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="mx-auto mt-12 flex max-w-md flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <HeartHandshake className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold text-zinc-900">
            No mutual matches yet
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-zinc-600">
            Swipe right in Discover on profiles that catch your eye. When the feeling is mutual, they will appear right here.
          </p>
          <Link
            to="/discover"
            className="mt-6 min-h-[48px] inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
          >
            Open Discover
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelect={setSelectedMatch}
            />
          ))}
        </div>
      )}

      <MatchDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </section>
  );
}
