import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import './AdminCategoriesPage.css';

export default function AdminCategoriesPage() {
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const fetchGroups = async () => {
  try {
    const data = await apiRequest('/groups');
    setGroups(data.results || []);
  } catch (err) {
    console.error('خطأ أثناء تحميل المجموعات:', err);
    setError('فشل تحميل المجموعات');
  }
};

const fetchCategories = async (group = '') => {
  try {
    setLoading(true);
    setError('');

    const path = group
      ? `/categories?group=${encodeURIComponent(group)}`
      : '/categories';

    const data = await apiRequest(path);

    setCategories(data.results || []);
  } catch (err) {
    console.error('خطأ أثناء تحميل التصنيفات:', err);
    setError('فشل تحميل التصنيفات');
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchGroups();
  fetchCategories();
}, []);
const filteredCategories = categories.filter((category) => {
  const categoryName =
    typeof category === 'object'
      ? category.name || category.title || ''
      : category;

  return categoryName
    .toLowerCase()
    .includes(searchText.trim().toLowerCase());
});
 return (
  <div className="admin-categories-page" dir="rtl">
    <h1>إدارة التصنيفات</h1>

    <div>
      <label>اختر المجموعة</label>

      <select
        value={selectedGroup}
        onChange={(e) => {
          const group = e.target.value;
          setSelectedGroup(group);
          fetchCategories(group);
        }}
      >
        <option value="">كل المجموعات</option>

        {groups.map((group) => {
          const groupName =
            typeof group === 'object'
              ? group.name || group.title || ''
              : group;

          return (
            <option key={groupName} value={groupName}>
              {groupName}
            </option>
          );
        })}
      </select>
    </div>
<div>
  <label>بحث في التصنيفات</label>

  <input
    type="text"
    placeholder="اكتب اسم التصنيف..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />
</div>
    <p>
     عدد التصنيفات: <strong>{filteredCategories.length}</strong>
    </p>

    {error && <p>{error}</p>}

    {loading ? (
      <p>جاري تحميل التصنيفات...</p>
    ) : categories.length === 0 ? (
      <p>لا توجد تصنيفات</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>اسم التصنيف</th>
          </tr>
        </thead>

        <tbody>
          {filteredCategories.map((category, index) => {
            const categoryName =
              typeof category === 'object'
                ? category.name || category.title || ''
                : category;

            return (
              <tr key={`${categoryName}-${index}`}>
                <td>{index + 1}</td>
                <td>{categoryName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
);
}
