import { Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/HomePage';
import ProvidersPage from './pages/ProvidersPage';
import ProviderDetailsPage from './pages/ProviderDetailsPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import AdminProvidersPage from './pages/AdminProvidersPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/providers" element={<ProvidersPage />} />
        <Route path="/providers/:id" element={<ProviderDetailsPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="providers" element={<AdminProvidersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;