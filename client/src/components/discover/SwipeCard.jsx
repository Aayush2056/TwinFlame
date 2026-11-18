import { useState } from 'react';
import { ChevronDown, ChevronUp, Heart, MapPin, GraduationCap, X } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { ProfilePhotoFrame } from '../common/ProfilePhotoFrame.jsx';

const SWIPE_OFFSET_THRESHOLD = 105;
const SWIPE_VELOCITY_THRESHOLD = 480;

export function SwipeCard({
  profile,
  isTopCard,
  exitDirection,
  onSwipe,
  disabled = false,
}) {
  const [expandedBio, setExpandedBio] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-12, 0, 12]);
  const likeOpacity = useTransform(x, [25, 110], [0, 1]);
  const passOpacity = useTransform(x, [-110, -25], [1, 0]);

  function handleDragEnd(_event, info) {
    if (disabled || !isTopCard) return;

    const swipedRight =
      info.offset.x > SWIPE_OFFSET_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD;
    const swipedLeft =
      info.offset.x < -SWIPE_OFFSET_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD;

    if (swipedRight) {
      onSwipe('like');
    } else if (swipedLeft) {
      onSwipe('pass');
    }
  }

  const exitX = exitDirection === 'like' ? 540 : exitDirection === 'pass' ? -540 : 0;
  const exitRotate = exitDirection === 'like' ? 16 : exitDirection === 'pass' ? -16 : 0;

  if (!isTopCard) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl overflow-hidden border border-stone-200 bg-white shadow-sm scale-[0.96] translate-y-2.5 opacity-65 pointer-events-none"
      >
        <ProfilePhotoFrame
          src={profile.photo.url}
          alt=""
          name={profile.name}
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
    );
  }

  return (
    <motion.article
      key={profile.id}
      style={{ x, rotate }}
      drag={disabled ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.96, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: exitX,
        rotate: exitRotate,
        opacity: 0,
        transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      whileDrag={{ cursor: 'grabbing' }}
      className="absolute inset-0 rounded-3xl overflow-hidden border border-stone-200 bg-zinc-900 shadow-lg cursor-grab touch-pan-y select-none"
      aria-label={`${profile.name}, ${profile.age} from ${profile.city}`}
    >
      <ProfilePhotoFrame
        src={profile.photo.url}
        alt={`Portrait of ${profile.name}`}
        name={profile.name}
        className="h-full w-full"
      />

      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute top-7 left-6 z-20 flex items-center gap-2 rounded-xl border-2 border-emerald-400 bg-emerald-950/75 px-3.5 py-1.5 text-emerald-300 backdrop-blur-xs -rotate-12"
      >
        <Heart className="h-5 w-5 fill-emerald-400 text-emerald-400" aria-hidden="true" />
        <span className="text-lg font-bold tracking-wider">LIKE</span>
      </motion.div>

      <motion.div
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute top-7 right-6 z-20 flex items-center gap-2 rounded-xl border-2 border-stone-300 bg-zinc-950/75 px-3.5 py-1.5 text-stone-200 backdrop-blur-xs rotate-12"
      >
        <X className="h-5 w-5 text-stone-200" aria-hidden="true" />
        <span className="text-lg font-bold tracking-wider">PASS</span>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 text-white">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white">
              {profile.name}
              <span className="ml-2 font-sans text-2xl font-normal text-stone-200 tabular-nums">
                {profile.age}
              </span>
            </h2>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-stone-200">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-stone-300 shrink-0" aria-hidden="true" />
                <span>{profile.city}</span>
              </span>
              <span aria-hidden="true" className="text-stone-400">
                ·
              </span>
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-stone-300 shrink-0" aria-hidden="true" />
                <span>{profile.college}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedBio((prev) => !prev);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={expandedBio ? 'Collapse profile bio' : 'Expand profile bio'}
            aria-expanded={expandedBio}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 shrink-0 cursor-pointer"
          >
            {expandedBio ? (
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronUp className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        <p
          className={`mt-2.5 text-sm leading-relaxed text-stone-100 ${
            expandedBio ? '' : 'line-clamp-2'
          }`}
        >
          {profile.bio}
        </p>

        <p className="mt-2.5 text-xs font-medium text-stone-300 leading-relaxed">
          {profile.interests.join(' · ')}
        </p>
      </div>
    </motion.article>
  );
}
