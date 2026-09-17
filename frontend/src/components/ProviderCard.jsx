import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';

export default function ProviderCard({ provider }) {
  const [phones, setPhones] = useState([]);
  const [contactRevealed, setContactRevealed] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [copied, setCopied] = useState(false);

  const primaryPhone =
    Array.isArray(phones) && phones.length > 0
      ? String(phones[0]).trim()
      : '';

  const cleanPhone = primaryPhone.replace(/[^0-9]/g, '');
  const isMobile = /^01[0125][0-9]{8}$/.test(cleanPhone);
  const waNumber = isMobile
    ? `20${cleanPhone.slice(1)}`
    : cleanPhone;

  const formatList = (field) => {
    if (!field) return '';

    if (Array.isArray(field)) {
      return field
        .map((i) =>
          typeof i === 'object' && i !== null
            ? i.name || i.title
            : i
        )
        .filter(Boolean)
        .join(' • ');
    }

    return String(field);
  };

  const handleRevealContact = async () => {
    try {
      setContactLoading(true);
      setContactError('');

      const data = await apiRequest(
        `/providers/${provider._id}/contact`
      );

      setPhones(
        Array.isArray(data?.phones)
          ? data.phones
          : []
      );

      setContactRevealed(true);
    } catch (error) {
      console.error(
        'خطأ أثناء تحميل رقم الهاتف:',
        error
      );

      setContactError(
        'تعذر تحميل رقم الهاتف، حاول مرة أخرى.'
      );
    } finally {
      setContactLoading(false);
    }
  };

  const handleCopy = () => {
    if (!primaryPhone) return;

    navigator.clipboard.writeText(primaryPhone);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="provider-card">
      <h3 className="provider-card-name">
        {provider.name}
      </h3>

      <div className="provider-card-meta">
        {formatList(provider.categories) ||
          formatList(provider.groups) ||
          'خدمات عامة'}
      </div>

      <div className="provider-card-area">
        📍 {provider.area || 'أبو زعبل'}
      </div>

      {!contactRevealed ? (
        <div className="provider-card-phone">
          <button
            type="button"
            onClick={handleRevealContact}
            disabled={contactLoading}
            className="btn-custom btn-reveal"
          >
            {contactLoading
              ? 'جاري تحميل الرقم...'
              : '📞 إظهار الرقم'}
          </button>

          {contactError && (
            <div className="contact-error">
              {contactError}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="provider-card-phone">
            📞{' '}
            {phones.length > 0
              ? phones.join(' / ')
              : 'غير متوفر'}
          </div>

          {primaryPhone && (
            <div className="provider-card-actions-row">
              <a
                href={`tel:${primaryPhone}`}
                className="btn-custom btn-call"
              >
                اتصال
              </a>

              {isMobile && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-custom btn-whatsapp"
                >
                  واتساب
                </a>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="btn-custom btn-copy"
              >
                {copied ? '✓ نُسخ' : 'نسخ'}
              </button>
            </div>
          )}
        </>
      )}

      <div className="provider-card-actions">
        <Link
          to={`/providers/${provider._id}`}
          className="btn-custom btn-details"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}