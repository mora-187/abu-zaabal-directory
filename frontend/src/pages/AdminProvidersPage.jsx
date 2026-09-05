import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editId, setEditId] = useState(null);

  const initialFormState = {
    name: '',
    phones: '',
    area: 'أبو زعبل',
    categories: '',
    groups: '',
    aliases: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // دالة مساعدة لتحويل الـ Arrays لنص مفصول بفواصل عند وضع التعديل
  const formatArrayField = (field) => {
    if (!field) return '';
    if (Array.isArray(field)) {
      return field
        .map(item => (typeof item === 'object' && item !== null ? item.name || item.title || '' : item))
        .filter(Boolean)
        .join(', ');
    }
    return String(field);
  };

  // 1. جلب البيانات (GET)
  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('/providers');
      setProviders(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('خطأ أثناء جلب البيانات:', err);
      setError('حدث خطأ أثناء تحميل مقدمي الخدمات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // 2. إرسال النموذج (POST / PUT) مع JSON.stringify والـ Validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      name: formData.name.trim(),
      phones: formData.phones.split(',').map(p => p.trim()).filter(Boolean),
      area: formData.area.trim(),
      categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
      groups: formData.groups.split(',').map(g => g.trim()).filter(Boolean),
      aliases: formData.aliases.split(',').map(a => a.trim()).filter(Boolean)
    };

    // Validation بسيط
    if (!payload.name || payload.phones.length === 0) {
      setError('الاسم ورقم هاتف واحد على الأقل مطلوبان');
      return;
    }

    try {
      setSaving(true);

      if (editId) {
        // تعديل (PUT)
        await apiRequest(`/providers/${editId}`, {
          method: 'PUT',
          auth: true,
          body: JSON.stringify(payload)
        });
        setSuccess('تم تعديل بيانات مقدم الخدمة بنجاح');
      } else {
        // إضافة (POST)
        await apiRequest('/providers', {
          method: 'POST',
          auth: true,
          body: JSON.stringify(payload)
        });
        setSuccess('تمت إضافة مقدم الخدمة بنجاح');
      }

      cancelEdit();
      fetchProviders();
    } catch (err) {
      console.error('خطأ أثناء الحفظ:', err);
      setError(err.message || 'فشل حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  // 3. حذف عنصر (DELETE) + عمل Refresh
  const handleDelete = async (id) => {
    if (!window.confirm('هل أنتِ متأكدة من حذف هذا العنصر؟')) return;

    setError('');
    setSuccess('');
    try {
      await apiRequest(`/providers/${id}`, {
        method: 'DELETE',
        auth: true
      });
      setSuccess('تم حذف مقدم الخدمة بنجاح');
      fetchProviders(); // عمل Refresh بعد الـ DELETE كما طلب
    } catch (err) {
      console.error('خطأ أثناء الحذف:', err);
      setError(err.message || 'فشل حذف مقدم الخدمة');
    }
  };

  // 4. وضع التعديل (تحميل كافة البيانات دون ضياع أي حقل)
  const startEdit = (item) => {
    setError('');
    setSuccess('');
    setEditId(item._id);
    setFormData({
      name: item.name || '',
      phones: formatArrayField(item.phones),
      area: item.area || 'أبو زعبل',
      categories: formatArrayField(item.categories),
      groups: formatArrayField(item.groups),
      aliases: formatArrayField(item.aliases)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // إلغاء التعديل
  const cancelEdit = () => {
    setEditId(null);
    setFormData(initialFormState);
  };

  return (
    <div className="p-4" dir="rtl">
      <h3 className="mb-3 fw-bold text-dark">إدارة مقدمي الخدمات</h3>

      {/* رسائل التنبيه والنجاح */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* نموذج الإضافة أو التعديل */}
      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3 fw-bold">{editId ? 'تعديل بيانات مقدم الخدمة' : 'إضافة مقدم خدمة جديد'}</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small fw-semibold">الاسم *</label>
            <input
              type="text"
              className="form-control"
              placeholder="اسم مقدم الخدمة"
              required
              disabled={saving}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">أرقام الهاتف (افصلي بفواصل) *</label>
            <input
              type="text"
              className="form-control"
              placeholder="01011223344, 01234567890"
              required
              disabled={saving}
              value={formData.phones}
              onChange={(e) => setFormData({ ...formData, phones: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">المنطقة</label>
            <input
              type="text"
              className="form-control"
              placeholder="المنطقة"
              disabled={saving}
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">التصنيفات (Categories)</label>
            <input
              type="text"
              className="form-control"
              placeholder="صيدليات, أطباء"
              disabled={saving}
              value={formData.categories}
              onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">المجموعات (Groups)</label>
            <input
              type="text"
              className="form-control"
              placeholder="الخدمات الطبية"
              disabled={saving}
              value={formData.groups}
              onChange={(e) => setFormData({ ...formData, groups: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">الأسماء المستعارة (Aliases)</label>
            <input
              type="text"
              className="form-control"
              placeholder="عيادة، صيدلية..."
              disabled={saving}
              value={formData.aliases}
              onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
            />
          </div>

          <div className="col-12 d-flex gap-2 justify-content-end mt-3">
            {editId && (
              <button type="button" onClick={cancelEdit} disabled={saving} className="btn btn-secondary px-4">
                إلغاء
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className={`btn ${editId ? 'btn-success' : 'btn-primary'} px-4`}
            >
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديل' : 'إضافة'}
            </button>
          </div>
        </div>
      </form>

      {loading && <p className="text-muted text-center py-4">جاري التحميل...</p>}

      {!loading && (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>الاسم</th>
                  <th>المنطقة</th>
                  <th>الهاتف</th>
                  <th>التصنيفات</th>
                  <th>المجموعات</th>
                  <th className="text-center" style={{ width: '180px' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-3 text-muted">لا يوجد مقدمو خدمات مسجلون</td>
                  </tr>
                ) : (
                  providers.map((item) => (
                    <tr key={item._id}>
                      <td className="fw-semibold">{item.name}</td>
                      <td>{item.area || 'أبو زعبل'}</td>
                      <td>
                        {Array.isArray(item.phones)
                          ? item.phones.join(', ')
                          : item.phones}
                      </td>
                      <td>
                        {Array.isArray(item.categories) && item.categories.length > 0
                          ? item.categories.map(c => (typeof c === 'object' && c !== null ? c.name : c)).join(', ')
                          : '—'}
                      </td>
                      <td>
                        {Array.isArray(item.groups) && item.groups.length > 0
                          ? item.groups.map(g => (typeof g === 'object' && g !== null ? g.name : g)).join(', ')
                          : '—'}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => startEdit(item)}
                          disabled={saving}
                        >
                          تعديل
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                          disabled={saving}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}