import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './SearchPage.css';
function SearchPage() {
  const [copiedPhone, setCopiedPhone] = useState('');
  const [revealedPhones, setRevealedPhones] = useState({});
const [contactLoading, setContactLoading] = useState({});
const [contactErrors, setContactErrors] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  );

  const [group, setGroup] = useState(
    searchParams.get('group') || ''
  );

  const [category, setCategory] = useState(
    searchParams.get('category') || ''
  );

  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const initialPage = Math.max(
    1,
    Number(searchParams.get('page')) || 1
  );
  const [page, setPage] = useState(initialPage);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('favoriteProviders') || '[]'
    );
  } catch {
    return [];
  }
});

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await apiRequest('/groups');
        setGroups(data.results || []);
      } catch (err) {
        console.error('Failed to load groups:', err);
      }
    };

    loadGroups();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {


        if (!group) {
          setCategories([]);
          return;
        }

        const data = await apiRequest(
          `/categories?group=${encodeURIComponent(group)}`
        );

        setCategories(data.results || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setCategories([]);
      }
    };

    loadCategories();
  }, [group]);

  const handleSearch = async (targetPage = 1) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append('search', search.trim());
      }

      if (group) {
        params.append('group', group);
      }

      if (category) {
        params.append('category', category);
      }

      params.append('page', String(targetPage));
      params.append('limit', '9');

      const data = await apiRequest(
        `/providers/search?${params.toString()}`
      );

      setResults(data.results || []);
      setPage(Number(data.page) || targetPage);
      setPages(Number(data.pages) || 1);
      setTotal(Number(data.total) || 0);
      const urlParams = {};

      if (search.trim()) {
        urlParams.search = search.trim();
      }

      if (group) {
        urlParams.group = group;
      }

      if (category) {
        urlParams.category = category;
      }

      if (targetPage > 1) {
        urlParams.page = String(targetPage);
      }

      setSearchParams(urlParams);
    } catch (err) {
      setError(err.message);
      setResults([]);
      setPage(1);
      setPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
  const loadDefaultResults = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/providers/search?page=1&limit=9');

      setResults(data.results || []);
      setPage(Number(data.page) || 1);
      setPages(Number(data.pages) || 1);
      setTotal(Number(data.total) || 0);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحميل مقدمي الخدمات');
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setSearch('');
    setGroup('');
    setCategory('');
    setCategories([]);
    setPage(1);
    setError('');
    setSearchParams({});

    loadDefaultResults();
  };
  useEffect(() => {

    handleSearch(initialPage);


  }, []);
  
const handleRevealContact = async (providerId) => {
  try {
    setContactLoading((prev) => ({
      ...prev,
      [providerId]: true
    }));

    setContactErrors((prev) => ({
      ...prev,
      [providerId]: ''
    }));

    const data = await apiRequest(
      `/providers/${providerId}/contact`
    );

    setRevealedPhones((prev) => ({
      ...prev,
      [providerId]: Array.isArray(data?.phones)
        ? data.phones
        : []
    }));
  } catch (err) {
    console.error('فشل تحميل رقم الهاتف:', err);

    setContactErrors((prev) => ({
      ...prev,
      [providerId]: 'تعذر تحميل رقم الهاتف.'
    }));
  } finally {
    setContactLoading((prev) => ({
      ...prev,
      [providerId]: false
    }));
  }
};

  const getWhatsAppNumber = (phone) => {
    const handleRevealContact = async (providerId) => {
  try {
    setContactLoading((prev) => ({
      ...prev,
      [providerId]: true
    }));

    setContactErrors((prev) => ({
      ...prev,
      [providerId]: ''
    }));

    const data = await apiRequest(
      `/providers/${providerId}/contact`
    );

    setRevealedPhones((prev) => ({
      ...prev,
      [providerId]: Array.isArray(data?.phones)
        ? data.phones
        : []
    }));
  } catch (err) {
    console.error('فشل تحميل رقم الهاتف:', err);

    setContactErrors((prev) => ({
      ...prev,
      [providerId]: 'تعذر تحميل رقم الهاتف.'
    }));
  } finally {
    setContactLoading((prev) => ({
      ...prev,
      [providerId]: false
    }));
  }
};
    const cleanPhone = String(phone).replace(/\D/g, '');

    if (cleanPhone.startsWith('01')) {
      return `20${cleanPhone.slice(1)}`;
    }

    return cleanPhone;
  };

  const handleCopyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);

      setCopiedPhone(phone);

      setTimeout(() => {
        setCopiedPhone('');
      }, 1500);
    } catch (err) {
      console.error('فشل نسخ رقم الهاتف:', err);
    }
  };

  const isEgyptianMobile = (phone) => {
    const cleanPhone = String(phone).replace(/\D/g, '');
    return /^01[0125]\d{8}$/.test(cleanPhone);
  };
  const handleFavorite = (providerId) => {
  let updatedFavorites;

  if (favoriteIds.includes(providerId)) {
    updatedFavorites = favoriteIds.filter(
      (id) => id !== providerId
    );
  } else {
    updatedFavorites = [
      ...favoriteIds,
      providerId
    ];
  }

  localStorage.setItem(
    'favoriteProviders',
    JSON.stringify(updatedFavorites)
  );

  setFavoriteIds(updatedFavorites);
};
  return (
    <main className="page-container search-page">
      <div className="search-header">
        <h1>البحث عن مقدم خدمة</h1>
        <p>ابحث بالاسم أو اختر المجموعة والتصنيف المناسب.</p>
      </div>
      <div className="search-controls">
        <input
          className="search-input"
          type="text"
          placeholder="اكتب اسم الخدمة أو مقدم الخدمة"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="search-select"
          value={group}
          onChange={(e) => {
            setGroup(e.target.value);
            setCategory('');
          }}
        >
          <option value="">كل المجموعات</option>

          {groups.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="search-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={!group}
        >
          <option value="">كل التصنيفات</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          className="search-button"
          type="button"
          onClick={() => handleSearch(1)}
          disabled={loading}
        >
          {loading ? 'جاري البحث...' : 'بحث'}
        </button>
        <button
          className="reset-button"
          type="button"
          onClick={handleReset}
        >
          مسح الفلاتر
        </button>
      </div>
      {loading && (
        <div className="search-state-card">
          <div className="search-loader"></div>

          <strong>جاري تحميل النتائج...</strong>

          <p>يرجى الانتظار لحظات.</p>
        </div>
      )}

      {error && (
        <div className="search-state-card search-error-card" role="alert">
          <strong>حدث خطأ أثناء تحميل النتائج</strong>

          <p>{error}</p>

          <button
            className="state-action-button"
            type="button"
            onClick={() => handleSearch(page)}
            disabled={loading}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        results.length === 0 &&
        (search || group || category) && (
          <div className="search-state-card search-empty-card">
            <strong>لا توجد نتائج مطابقة</strong>

            <p>
              جرّب تغيير كلمة البحث أو اختيار مجموعة أو تصنيف مختلف.
            </p>

            <button
              className="state-action-button empty-reset-button"
              type="button"
              onClick={handleReset}
            >
              مسح الفلاتر
            </button>
          </div>
        )}

      {!loading && !error && total > 0 && (
        <p>
          عدد النتائج: {total} - الصفحة {page} من {pages}
        </p>
      )}


      <div className="search-results-grid">
        {results.map((provider) => (
          <article className="provider-card" key={provider._id}>
            <div className="provider-card-header">
              <span className="provider-card-badge">
                {provider.categories?.[0] || 'مقدم خدمة'}
              </span>

              <h3>{provider.name}</h3>
            </div>

            {provider.groups?.length > 0 && (
              <p className="provider-card-info">
                <strong>المجموعة:</strong>{' '}
                {provider.groups.join(' - ')}
              </p>
            )}

            {provider.categories?.length > 0 && (
              <p className="provider-card-info">
                <strong>التصنيف:</strong>{' '}
                {provider.categories.join(' - ')}
              </p>
            )}

            {provider.area && (
              <p className="provider-card-info">
                <strong>المنطقة:</strong>{' '}
                {provider.area}
              </p>
            )}

            {!Object.prototype.hasOwnProperty.call(
  revealedPhones,
  provider._id
) ? (
  <div className="provider-card-phones">
    <button
      type="button"
      className="provider-phone-button provider-reveal-button"
      onClick={() => handleRevealContact(provider._id)}
      disabled={contactLoading[provider._id]}
    >
      {contactLoading[provider._id]
        ? 'جاري تحميل الرقم...'
        : '📞 إظهار الرقم'}
    </button>

    {contactErrors[provider._id] && (
      <p className="contact-error">
        {contactErrors[provider._id]}
      </p>
    )}
  </div>
) : revealedPhones[provider._id].length === 0 ? (
  <div className="provider-card-phones">
    <p>رقم الهاتف غير متوفر</p>
  </div>
) : (
  <div className="provider-card-phones">
    {revealedPhones[provider._id].map((phone) => {
      const whatsappNumber =
        getWhatsAppNumber(phone);

      const showWhatsApp =
        isEgyptianMobile(phone);

      return (
        <div
          className="provider-phone-actions"
          key={phone}
        >
          <a
            href={`tel:${phone}`}
            className="provider-phone-button provider-call-button"
          >
            اتصال: {phone}
          </a>

          {showWhatsApp && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="provider-phone-button provider-whatsapp-button"
            >
              واتساب
            </a>
          )}

          <button
            type="button"
            className="provider-phone-button provider-copy-button"
            onClick={() => handleCopyPhone(phone)}
          >
            {copiedPhone === phone
              ? '✓ تم النسخ'
              : 'نسخ الرقم'}
          </button>

          <button
  type="button"
  className={`search-favorite-button ${
    favoriteIds.includes(provider._id)
      ? 'favorite-active'
      : ''
  }`}
  onClick={() => handleFavorite(provider._id)}
>
  {favoriteIds.includes(provider._id)
    ? '♥ في المفضلة'
    : '♡ إضافة للمفضلة'}
</button>
        </div>
      );
    })}
  </div>
)}
          </article>
        ))}
      </div>
      {
        !loading && !error && pages > 1 && (
          <div className="search-pagination">
            <button
              className="pagination-button"
              type="button"
              onClick={() => handleSearch(page - 1)}
              disabled={page <= 1}
            >
              السابق
            </button>

            <span className="pagination-info">
              الصفحة {page} من {pages}
            </span>

            <button
              className="pagination-button"
              type="button"
              onClick={() => handleSearch(page + 1)}
              disabled={page >= pages}
            >
              التالي
            </button>
          </div>
        )
      }
    </main >
  );
}

export default SearchPage;
