// lib/certFields.js
// Single source of truth for which fields a certification document may hold.
//
// The old POST handler built the document by hand and silently dropped
// imagePublicId, so replacing a cert image later could never delete the old
// Cloudinary file. PUT passed the request body straight into $set, so any
// field at all could be written. Both now go through this whitelist.

const STRING_FIELDS = [
  "title",
  "issuer",         // e.g. "Salesforce"
  "issueDate",      // "YYYY-MM" from <input type="month">
  "credentialId",
  "credentialUrl",  // public verification page (Trailhead, Credly, Coursera…)
  "imageUrl",
  "imagePublicId",
];

export function normalizeCert(body = {}, { partial = false } = {}) {
  const doc = {};

  for (const key of STRING_FIELDS) {
    if (key in body) doc[key] = typeof body[key] === "string" ? body[key].trim() : "";
    else if (!partial) doc[key] = "";
  }

  // Only allow real web links for the verify button
  if (doc.credentialUrl && !/^https?:\/\//i.test(doc.credentialUrl)) {
    doc.credentialUrl = "";
  }

  if ("skills" in body || !partial) {
    const raw = body.skills ?? [];
    const list = Array.isArray(raw) ? raw : String(raw).split(",");
    doc.skills = list.map(s => String(s).trim()).filter(Boolean).slice(0, 8);
  }

  if ("featured" in body || !partial) doc.featured = body.featured === true;

  if ("order" in body || !partial) {
    const n = Number(body.order);
    doc.order = Number.isFinite(n) ? n : 0;
  }

  return doc;
}
