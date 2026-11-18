import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-lg">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 [text-wrap:balance]">
          Home
        </h1>

        <p className="mt-4 text-base leading-relaxed text-zinc-600">
          This space is reserved for your home experience. Head over to Discover to explore profiles and find mutual matches.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/discover"
            className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
          >
            <span>Open Discover</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <Link
            to="/matches"
            className="min-h-[48px] inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 underline-offset-4 hover:underline whitespace-nowrap"
          >
            View Matches
          </Link>
        </div>
      </div>
    </section>
  );
}