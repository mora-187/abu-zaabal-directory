import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiRequest('/groups');
        setGroups(data.results || []);
      } catch (err) {
        setError(err.message);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  const handleSearch = () => {
    const term = search.trim();

    if (term) {
      navigate(`/search?search=${encodeURIComponent(term)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <main>
      <section className="home-hero">
        <h1>دليل خدمات أبو زعبل</h1>
        <p>
          ابحث عن مقدمي الخدمات في أبو زعبل بسهولة، أو تصفح المجموعات
          للوصول إلى ما تحتاجه.
        </p>

        <div className="home-search">
          <input
            type="text"
            placeholder="اكتب اسم الخدمة أو مقدم الخدمة"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />

          <button type="button" onClick={handleSearch}>
            بحث
          </button>
        </div>
      </section>

      <section className="home-section">
        <h2>المجموعات الرئيسية</h2>

        {loading && (
          <div className="home-state-card">
            جاري تحميل المجموعات...
          </div>
        )}

        {error && (
          <div className="home-state-card home-error-card" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="home-groups-grid">
            {groups.map((group) => (
              <Link
                key={group}
                to={`/search?group=${encodeURIComponent(group)}`}
                className="group-card"
              >
                {group}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;