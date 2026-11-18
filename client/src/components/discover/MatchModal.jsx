import { HeartHandshake, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ProfilePhotoFrame } from '../common/ProfilePhotoFrame.jsx';

export function MatchModal({ match, onClose, onViewMatches }) {
  return (
    <AnimatePresence>
      {match && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="match-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl"
          >
            <div className="relative h-72 w-full overflow-hidden">
              <ProfilePhotoFrame
                src={match.profile.photo.url}
                alt={`Portrait of ${match.profile.name}`}
                name={match.profile.name}
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-rose-300">
                  <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                  <span>Mutual Match</span>
                </div>
                <h2
                  id="match-modal-title"
                  className="mt-1 font-display text-4xl font-semibold tracking-tight text-white"
                >
                  It&apos;s a Match!
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-base font-medium text-zinc-900">
                You and {match.profile.name} liked each other.
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {match.profile.city} · {match.profile.college}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onViewMatches}
                  className="min-h-[48px] flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span>View Matches</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[48px] flex-1 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-stone-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
                >
                  Keep Swiping
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
