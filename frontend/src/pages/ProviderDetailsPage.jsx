import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './ProviderDetailsPage.css';

export default function ProviderDetailsPage() {
  const { id } = useParams();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [phones, setPhones] = useState([]);
  const [contactRevealed, setContactRevealed] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiRequest(`/providers/${id}`);

        setProvider(data.result || data);
      } catch (err) {
        console.error(
          'خطأ أثناء جلب تفاصيل مقدم الخدمة:',
          err
        );

        setError(
          'تعذر العثور على بيانات مقدم الخدمة'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [id]);

  const handleRevealContact = async () => {
    try {
      setContactLoading(true);
      setContactError('');

      const data = await apiRequest(
        `/providers/${id}/contact`
      );

      setPhones(
        Array.isArray(data?.phones)
          ? data.phones
          : []
      );

      setContactRevealed(true);
    } catch (err) {
      console.error(
        'خطأ أثناء تحميل رقم الهاتف:',
        err
      );

      setContactError(
        'تعذر تحميل رقم الهاتف، حاول مرة أخرى.'
      );
    } finally {
      setContactLoading(false);
    }
  };

  const handleCopy = (phone) => {
    navigator.clipboard.writeText(phone);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const formatList = (field) => {
    if (!field) return '—';

    if (Array.isArray(field)) {
      return field
        .map((i) =>
          typeof i === 'object' && i !== null
            ? i.name || i.title
            : i
        )
        .filter(Boolean)
        .join(', ');
    }

    return String(field);
  };

  if (loading) {
    return (
      <div className="provider-details-container state-message">
        جاري تحميل التفاصيل...
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="provider-details-container state-error">
        {error || 'غير موجود'}
      </div>
    );
  }

  const mainPhone =
    phones.length > 0
      ? String(phones[0]).trim()
      : '';

  return (
    <div className="provider-details-container">
      <div className="details-box">

        <Link
          to="/providers"
          className="back-link"
        >
          ← العودة لدليل الخدمات
        </Link>

        <h1 className="details-title">
          {provider.name}
        </h1>

        <p className="details-subtitle">
          {formatList(provider.categories)}
        </p>

        <div className="details-row">
          <span className="details-label">
            المنطقة:
          </span>

          <span className="details-value">
            {provider.area || 'أبو زعبل'}
          </span>
        </div>

        <div className="details-row">
          <span className="details-label">
            المجموعة:
          </span>

          <span className="details-value">
            {formatList(provider.groups)}
          </span>
        </div>

        {provider.aliases?.length > 0 && (
          <div className="details-row">
            <span className="details-label">
              معروف أيضاً بـ:
            </span>

            <span className="details-value">
              {formatList(provider.aliases)}
            </span>
          </div>
        )}

        <div className="details-row">
          <span className="details-label">
            أرقام التواصل:
          </span>

          <span className="details-value">

            {!contactRevealed ? (
              <button
                type="button"
                onClick={handleRevealContact}
                disabled={contactLoading}
                className="btn-details-reveal"
              >
                {contactLoading
                  ? 'جاري تحميل الرقم...'
                  : '📞 إظهار الرقم'}
              </button>
            ) : phones.length > 0 ? (
              phones.join(' - ')
            ) : (
              'رقم الهاتف غير متوفر'
            )}

          </span>
        </div>

        {contactError && (
          <div className="contact-error">
            {contactError}
          </div>
        )}

        {contactRevealed && mainPhone && (
          <div className="details-actions">

            <a
              href={`tel:${mainPhone}`}
              className="btn-details-call"
            >
              اتصال الآن
            </a>

            <button
              type="button"
              onClick={() => handleCopy(mainPhone)}
              className="btn-details-copy"
            >
              {copied
                ? '✓ تم نسخ الرقم'
                : 'نسخ رقم الهاتف'}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}