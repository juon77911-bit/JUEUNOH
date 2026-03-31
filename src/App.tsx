import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProjectPage from './pages/ProjectPage';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <PortfolioProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="admin" element={<Admin />} />
              <Route path="project/:id" element={<ProjectPage />} />
            </Route>
          </Routes>
        </Router>
      </PortfolioProvider>
    </ErrorBoundary>
  );
}
