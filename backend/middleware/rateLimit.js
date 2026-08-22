const buckets = new Map();
let requestCount = 0;

const getClientKey = (req) => req.ip || req.socket?.remoteAddress || 'unknown';

const createRateLimit = ({ windowMs, max, message }) => (req, res, next) => {
  const now = Date.now();
  requestCount += 1;
  if (requestCount % 1000 === 0) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }
  const key = `${req.baseUrl}${req.path}:${getClientKey(req)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  current.count += 1;
  if (current.count > max) {
    res.setHeader('Retry-After', Math.max(1, Math.ceil((current.resetAt - now) / 1000)));
    return res.status(429).json({ message });
  }

  return next();
};

module.exports = { createRateLimit };
