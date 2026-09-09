const normalizeArabic = (text = "") => {
  return String(text)
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "") // remove Arabic diacritics
    .replace(/ـ/g, "")                     // remove tatweel
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const generateSearchText = (provider = {}) => {
  const values = [
    provider.name,
    ...(provider.phones || []),
    ...(provider.groups || []),
    ...(provider.categories || []),
    provider.description,
    provider.area,
    ...(provider.aliases || [])
  ];

  return normalizeArabic(
    values.filter(Boolean).join(" ")
  );
};

module.exports = {
  normalizeArabic,
  generateSearchText
};