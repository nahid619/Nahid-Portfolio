// lib/categoryStyles.js
//
// BUG FIX — "wrong tag on the All Projects page"
//
// AllProjectsClient used to carry its own hardcoded map:
//
//   const categoryColors = {
//     salesforce: { ..., label: "Salesforce" },
//     sqa:        { ..., label: "SQA"        },
//     web:        { ..., label: "Web"        },
//   };
//   const cat = categoryColors[project.category] || categoryColors.web;
//
// Categories are DB-driven — you can add one from the admin panel at any
// time. "Special" was added there, but never to this map, so it fell
// through to `|| categoryColors.web` and inherited the label "Web".
// The badge then confidently displayed the wrong category. That's the gap.
//
// The admin panel got this right by accident: its StatusBadge takes `label`
// as a separate prop from `type`, so an unknown type only lost its colour,
// never its text. This module applies the same separation everywhere:
//   - label comes from the DB category record (single source of truth)
//   - colour comes from a lookup that degrades to a generated colour
// Adding a category in the admin panel now needs no code change at all.

// Explicit colours for the categories that already shipped, so nothing
// changes visually for existing projects.
const KNOWN_STYLES = {
  salesforce:  { bg: "#0c2a4a", text: "#60a5fa" },
  sqa:         { bg: "#0e3501", text: "#9BEC00" },
  web:         { bg: "#2d1b00", text: "#fb923c" },
  programming: { bg: "#2d0045", text: "#c084fc" },
  special:     { bg: "#0c3b3b", text: "#2dd4bf" }, // teal — distinct from Salesforce blue
};

// Any category added in future gets a stable colour from this palette
// rather than silently borrowing another category's identity.
const FALLBACK_PALETTE = [
  { bg: "#2d0045", text: "#c084fc" }, // purple
  { bg: "#0c3b3b", text: "#2dd4bf" }, // teal
  { bg: "#3b0a24", text: "#f472b6" }, // pink
  { bg: "#2b2a00", text: "#facc15" }, // amber
  { bg: "#0a2f1a", text: "#4ade80" }, // green
];

const NEUTRAL = { bg: "#02275b", text: "#bcc4ba" };

// Deterministic so a given category always renders the same colour,
// across reloads and across pages.
function stableIndex(str, length) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

/**
 * Badge colours for a category value.
 * Never falls back to another named category's colours.
 */
export function getCategoryStyle(value) {
  const key = String(value ?? "").toLowerCase().trim();
  if (!key) return NEUTRAL;
  if (KNOWN_STYLES[key]) return KNOWN_STYLES[key];
  return FALLBACK_PALETTE[stableIndex(key, FALLBACK_PALETTE.length)];
}

/**
 * Display label for a category value, resolved against the DB categories.
 *
 * @param value      the project's category value, e.g. "special"
 * @param categories the array from getCategories("projects")
 */
export function getCategoryLabel(value, categories = []) {
  const key = String(value ?? "").trim();
  if (!key) return "";

  const match = categories.find(c => c.value === key);
  if (match?.name) return match.name;

  // The category value exists on the project but has no matching category
  // record (e.g. it was deleted in the admin panel). Show the raw value,
  // title-cased — wrong-but-honest beats confidently-wrong.
  return key.charAt(0).toUpperCase() + key.slice(1);
}