import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ScoutPage } from './pages/ScoutPage';
import { WatchlistPage } from './pages/WatchlistPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/scout" element={<ScoutPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          {/* Fallback route */}
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
