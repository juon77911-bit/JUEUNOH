import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProjectDetail from './pages/ProjectDetail';

export default function App() {
  return (
    <PortfolioProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="admin" element={<Admin />} />
            <Route path="project/:id" element={<ProjectDetail />} />
          </Route>
        </Routes>
      </Router>
    </PortfolioProvider>
  );
}
