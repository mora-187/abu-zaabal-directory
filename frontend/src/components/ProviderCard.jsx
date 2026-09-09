
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProviderCard({ provider }) {
  const [copied, setCopied] = useState(false);

  const primaryPhone = Array.isArray(provider.phones) && provider.phones.length > 0
    ? String(provider.phones[0]).trim()
    : String(provider.phones || '').trim();

  const cleanPhone = primaryPhone.replace(/[^0-9]/g, '');
  const isMobile = /^01[0125][0-9]{8}$/.test(cleanPhone);
  const waNumber = isMobile ? `20${cleanPhone.slice(1)}` : cleanPhone;

  const formatList = (field) => {
    if (!field) return '';
    if (Array.isArray(field)) {
      return field
        .map(i => (typeof i === 'object' && i !== null ? i.name || i.title : i))
        .filter(Boolean)
        .join(' • ');
    }
    return String(field);
  };

  const handleCopy = (e) => {
    e.preventDefault();
    if (primaryPhone) {
      navigator.clipboard.writeText(primaryPhone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="provider-card">
      <h3 className="provider-card-name">{provider.name}</h3>

      <div className="provider-card-meta">
        {formatList(provider.categories) || formatList(provider.groups) || 'خدمات عامة'}
      </div>

      <div className="provider-card-area">
        📍 {provider.area || 'أبو زعبل'}
      </div>

      <div className="provider-card-phone">
        📞 {Array.isArray(provider.phones) ? provider.phones.join(' / ') : primaryPhone || 'غير متوفر'}
      </div>

      <div className="provider-card-actions">
        <div className="provider-card-actions-row">
          {primaryPhone && (
            <a href={`tel:${primaryPhone}`} className="btn-custom btn-call">
              اتصال
            </a>
          )}

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

          {primaryPhone && (
            <button type="button" onClick={handleCopy} className="btn-custom btn-copy">
              {copied ? '✓ نُسخ' : 'نسخ'}
            </button>
          )}
        </div>

        <Link to={`/providers/${provider._id}`} className="btn-custom btn-details">
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}