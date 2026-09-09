// import React, { useState, useEffect } from 'react';
// import { apiRequest } from '../services/api';
// import ProviderCard from '../components/ProviderCard';
// import './ProvidersPage.css';

// export default function ProvidersPage() {
//   const [providers, setProviders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const fetchProviders = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const data = await apiRequest('/providers');
//       setProviders(Array.isArray(data) ? data : data.results || []);
//     } catch (err) {
//       console.error('خطأ أثناء جلب مقدمي الخدمات:', err);
//       setError('تعذر تحميل مقدمي الخدمات، يرجى المحاولة لاحقاً.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProviders();
//   }, []);

//   return (
//     <div className="providers-page-container">
//       <div className="providers-page-header">
//         <h1>دليل مقدمي الخدمات</h1>
//         <p>تصفح وتواصل مع أصحاب المهن والخدمات في أبو زعبل</p>
//       </div>

//       {error && <div className="state-error">{error}</div>}

//       {loading ? (
//         <div className="state-message">جاري تحميل الخدمات...</div>
//       ) : providers.length === 0 ? (
//         <div className="state-message">لا يوجد مقدمو خدمات مسجلون حالياً.</div>
//       ) : (
//         <div className="providers-grid">
//           {providers.map((provider) => (
//             <ProviderCard key={provider._id} provider={provider} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import ProviderCard from '../components/ProviderCard';
import './ProvidersPage.css';

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('/providers');
      setProviders(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('خطأ أثناء جلب مقدمي الخدمات:', err);
      setError('تعذر تحميل مقدمي الخدمات، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // تصفية سريعة بالاسم بدون عمل Request جديد
  const filteredProviders = providers.filter((p) =>
    (p.name || '').toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="providers-page-container">
      <div className="providers-page-header">
        <h1>دليل مقدمي الخدمات</h1>
        <p>تصفح وتواصل مع أصحاب المهن والخدمات في أبو زعبل</p>
      </div>

      {/* شريط البحث اللحظي */}
      {!loading && providers.length > 0 && (
        <div className="quick-search-box">
          <input
            type="text"
            className="quick-search-input"
            placeholder="🔍 بحث سريع باسم مقدم الخدمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {error && <div className="state-error">{error}</div>}

      {loading ? (
        <div className="state-message">جاري تحميل الخدمات...</div>
      ) : filteredProviders.length === 0 ? (
        <div className="state-message">لا توجد نتائج مطابقة لبحثك.</div>
      ) : (
        <div className="providers-grid">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider._id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}