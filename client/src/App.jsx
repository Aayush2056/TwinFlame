import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/common/AppShell.jsx';
import { DiscoveryProvider } from './context/DiscoveryContext.jsx';
import { DiscoverPage } from './pages/DiscoverPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { MatchesPage } from './pages/MatchesPage.jsx';

export default function App() {
  return (
    <DiscoveryProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="*" element={<Navigate to="/discover" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DiscoveryProvider>
  );
}
