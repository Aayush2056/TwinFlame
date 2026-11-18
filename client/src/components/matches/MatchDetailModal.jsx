import { GraduationCap, MapPin, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { formatMatchDate } from '../../utils/formatters.js';
import { ProfilePhotoFrame } from '../common/ProfilePhotoFrame.jsx';

export function MatchDetailModal({ match, onClose }) {
  return (
    <AnimatePresence>
      {match && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="selected-match-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl"
          >
            <div className="relative h-72 w-full">
              <ProfilePhotoFrame
                src={match.profile.photo.url}
                alt={`Portrait of ${match.profile.name}`}
                name={match.profile.name}
                className="h-full w-full"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close profile dialog"
                className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950/65 text-white backdrop-blur-sm hover:bg-zinc-950/85 cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2
                  id="selected-match-title"
                  className="font-display text-3xl font-semibold text-zinc-900"
                >
                  {match.profile.name},{' '}
                  <span className="font-sans text-2xl font-normal text-zinc-600 tabular-nums">
                    {match.profile.age}
                  </span>
                </h2>
                <span className="text-xs font-medium text-rose-700 tabular-nums">
                  Matched {formatMatchDate(match.matchedAt)}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                  <span>{match.profile.city}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                  <span>{match.profile.college}</span>
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-zinc-800">
                {match.profile.bio}
              </p>

              <div className="mt-5 border-t border-stone-100 pt-4">
                <p className="text-xs font-semibold text-zinc-500">Interests</p>
                <p className="mt-1.5 text-sm font-medium text-zinc-800">
                  {match.profile.interests.join(' · ')}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
