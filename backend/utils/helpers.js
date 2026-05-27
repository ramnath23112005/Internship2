const generateCertificateId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `IMPACTX-${timestamp}-${random}`;
};

const calculateProgress = (raised, target) => {
  if (target === 0) return 0;
  return Math.min(Math.round((raised / target) * 100), 100);
};

const paginateResults = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit), page: parseInt(page) };
};

const sanitizeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

module.exports = { generateCertificateId, calculateProgress, paginateResults, sanitizeHtml };
