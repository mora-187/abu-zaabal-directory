import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import ProviderCard from '../components/ProviderCard';
import './ProvidersPage.css';
export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        setError('');

        const savedIds = JSON.parse(
          localStorage.getItem('favoriteProviders') || '[]'
        );

        if (savedIds.length === 0) {
          setFavorites([]);
          return;
        }

        const data = await apiRequest('/providers');

        const providers = Array.isArray(data)
          ? data
          : data.results || [];

        const favoriteProviders = providers.filter((provider) =>
          savedIds.includes(provider._id)
        );

        setFavorites(favoriteProviders);
      } catch (err) {
        console.error('خطأ أثناء تحميل المفضلة:', err);
        setError('تعذر تحميل المفضلة.');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-message">
          جاري تحميل المفضلة...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="state-error">
          {error}
        </div>
      </div>
    );
  }
  const handleFavoriteChange = (providerId, isFavorite) => {
  if (!isFavorite) {
    setFavorites((prev) =>
      prev.filter((provider) => provider._id !== providerId)
    );
  }
};

  return (
  <div className="providers-page-container">
<div className="providers-page-header">
        <h1>المفضلة</h1>
        <p>
          مقدمو الخدمات الذين قمت بحفظهم
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="state-message">
          لا يوجد مقدمو خدمات في المفضلة حتى الآن.
        </div>
      ) : (
        <div className="providers-grid">
          {favorites.map((provider) => (
           <ProviderCard
  key={provider._id}
  provider={provider}
  onFavoriteChange={handleFavoriteChange}
/>
          ))}
        </div>
      )}
    </div>
  );
}