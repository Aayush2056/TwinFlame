import { formatMatchDate } from '../../utils/formatters.js';
import { ProfilePhotoFrame } from '../common/ProfilePhotoFrame.jsx';

export function MatchCard({ match, onSelect }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xs transition-shadow hover:shadow-md flex flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <ProfilePhotoFrame
          src={match.profile.photo.url}
          alt={`Portrait of ${match.profile.name}`}
          name={match.profile.name}
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-white">
          <h2 className="font-display text-2xl font-semibold">
            {match.profile.name},{' '}
            <span className="font-sans text-lg font-normal text-stone-200 tabular-nums">
              {match.profile.age}
            </span>
          </h2>
          <span className="text-xs font-medium text-stone-200 tabular-nums">
            Matched {formatMatchDate(match.matchedAt)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-xs font-medium text-zinc-600">
            {match.profile.city} · {match.profile.college}
          </p>
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-zinc-700">
            {match.profile.bio}
          </p>
        </div>

        <div className="mt-5 border-t border-stone-100 pt-4 flex items-center justify-between gap-3">
          <span className="truncate text-xs text-zinc-500">
            {match.profile.interests.slice(0, 2).join(' · ')}
          </span>
          <button
            type="button"
            onClick={() => onSelect(match)}
            className="min-h-[40px] shrink-0 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:bg-stone-100 cursor-pointer whitespace-nowrap"
          >
            View Profile
          </button>
        </div>
      </div>
    </article>
  );
}
