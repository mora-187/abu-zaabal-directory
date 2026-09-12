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
  <main className="home-page">
    <section className="home-hero">
      <div className="home-hero-content">

        <span className="home-kicker">
          دليلي لخدمات أبو زعبل
        </span>

        <h1>
          كل خدمات أبو زعبل
          <span> في مكان واحد</span>
        </h1>

        <p className="home-hero-text">
          ابحث عن مقدم الخدمة أو النشاط الذي تحتاجه،
          وتواصل معه مباشرة بسهولة.
        </p>

        <div className="home-search">
          <input
            type="text"
            placeholder="اكتب اسم الخدمة أو مقدم الخدمة..."
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

        <div className="home-features">
          <span>بحث سريع</span>
          <span>اتصال مباشر</span>
          <span>واتساب</span>
        </div>
      </div>
    </section>

    <section className="home-section">
      <div className="home-section-heading">
        <div>
          <span className="section-label">استكشف الدليل</span>
          <h2>المجموعات الرئيسية</h2>
          <p>
            اختر المجموعة المناسبة للوصول إلى مقدمي الخدمات بسهولة.
          </p>
        </div>

        <Link to="/search" className="home-view-all">
          عرض كل الخدمات
        </Link>
      </div>

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
          {groups.map((group, index) => (
            <Link
              key={group}
              to={`/search?group=${encodeURIComponent(group)}`}
              className="group-card"
            >
              <div className="group-card-icon">
                {index + 1}
              </div>

              <div className="group-card-content">
                <strong>{group}</strong>
                <span>استعرض الخدمات</span>
              </div>

              <span className="group-card-arrow">
                ←
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>

    <section className="home-cta">
      <div>
        <span className="section-label">
          دليل الخدمات
        </span>

        <h2>مش عارف تبدأ منين؟</h2>

        <p>
          تصفح جميع مقدمي الخدمات الموجودين في دليل أبو زعبل.
        </p>
      </div>

      <Link to="/providers" className="home-cta-button">
        تصفح مقدمي الخدمات
      </Link>
    </section>
  </main>
);
}

export default HomePage;