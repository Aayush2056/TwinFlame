import { useState } from 'react';
import { UserRound } from 'lucide-react';

export function ProfilePhotoFrame({ src, alt, name, className = '' }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-stone-200 via-rose-50 to-stone-300 text-zinc-700 ${className}`}
        aria-label={alt}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm">
          <UserRound className="h-8 w-8 text-rose-600" aria-hidden="true" />
        </div>
        <span className="mt-3 font-display text-lg font-medium text-zinc-800">{name}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setHasError(true)}
      className={`select-none object-cover object-center ${className}`}
    />
  );
}
