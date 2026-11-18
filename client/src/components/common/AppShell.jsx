import { Flame, HeartHandshake, Home } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDiscoveryContext } from '../../context/DiscoveryContext.jsx';

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { matchCount, handleResetDemo, isResetting } = useDiscoveryContext();
  const isDiscoverRoute = location.pathname === '/discover';

  return (
    <div className="min-h-dvh flex flex-col bg-[#FAF9F7] text-zinc-900">
      {/* Desktop Header — Strict 3-Zone Top Bar Contract */}
      <header className="hidden md:flex sticky top-0 z-30 h-16 items-center justify-between gap-8 border-b border-stone-200 bg-[#FAF9F7]/90 px-8 backdrop-blur-md">
        <NavLink
          to="/"
          className="font-display text-xl font-semibold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 rounded"
        >
          TwinFlame
        </NavLink>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-8 text-sm font-medium"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                isActive
                  ? 'border-rose-600 text-zinc-900'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/discover"
            className={({ isActive }) =>
              `py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                isActive
                  ? 'border-rose-600 text-zinc-900'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`
            }
          >
            Discover
          </NavLink>
          <NavLink
            to="/matches"
            className={({ isActive }) =>
              `py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 tabular-nums ${
                isActive
                  ? 'border-rose-600 text-zinc-900'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`
            }
          >
            {matchCount > 0 ? `Matches (${matchCount})` : 'Matches'}
          </NavLink>
        </nav>

        <div className="shrink-0">
          {isDiscoverRoute ? (
            <button
              type="button"
              onClick={() => void handleResetDemo()}
              disabled={isResetting}
              className="min-h-[40px] rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:bg-stone-100 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
            >
              {isResetting ? 'Resetting...' : 'Reset Deck'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="min-h-[40px] rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              Open Discover
            </button>
          )}
        </div>
      </header>

      {/* Compact Mobile Top Header (52px) */}
      <header className="md:hidden sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-stone-200 bg-[#FAF9F7]/92 px-4 backdrop-blur-md">
        <NavLink
          to="/"
          className="font-display text-lg font-semibold tracking-tight text-zinc-900 whitespace-nowrap shrink-0"
        >
          TwinFlame
        </NavLink>
        {isDiscoverRoute ? (
          <button
            type="button"
            onClick={() => void handleResetDemo()}
            disabled={isResetting}
            className="min-h-[44px] px-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isResetting ? 'Resetting...' : 'Reset'}
          </button>
        ) : (
          <NavLink
            to="/discover"
            className="min-h-[44px] flex items-center px-2 text-xs font-semibold text-rose-600 whitespace-nowrap shrink-0"
          >
            Discover
          </NavLink>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-[72px] md:pb-10">
        <Outlet />
      </main>

      {/* Mobile Fixed Bottom Tab Bar (60px) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 grid h-[60px] grid-cols-3 items-center border-t border-stone-200 bg-white/95 backdrop-blur-md"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-rose-600' : 'text-zinc-500 hover:text-zinc-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home
                className="h-5 w-5"
                strokeWidth={isActive ? 2.4 : 1.8}
                aria-hidden="true"
              />
              <span>Home</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/discover"
          className={({ isActive }) =>
            `flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-rose-600' : 'text-zinc-500 hover:text-zinc-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Flame
                className="h-5 w-5"
                strokeWidth={isActive ? 2.4 : 1.8}
                aria-hidden="true"
              />
              <span>Discover</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/matches"
          className={({ isActive }) =>
            `flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors tabular-nums ${
              isActive ? 'text-rose-600' : 'text-zinc-500 hover:text-zinc-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <HeartHandshake
                className="h-5 w-5"
                strokeWidth={isActive ? 2.4 : 1.8}
                aria-hidden="true"
              />
              <span>{matchCount > 0 ? `Matches (${matchCount})` : 'Matches'}</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}
