// lib/calculateExperience.js

/**
 * Given an array of experience documents, calculates total professional duration.
 * @param {Array} experiences
 * @returns {string} e.g. "11 months" or "1 year 5 months"
 */
export function calculateTotalExperience(experiences) {
  if (!experiences || experiences.length === 0) return "0 months";

  let totalMonths = 0;

  for (const exp of experiences) {
    const start = parseYearMonth(exp.startDate);
    if (!start) continue;

    const end = exp.isCurrent || !exp.endDate
      ? new Date()
      : parseYearMonth(exp.endDate);
    if (!end) continue;

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (months > 0) totalMonths += months;
  }

  return formatMonths(totalMonths);
}

function parseYearMonth(str) {
  if (!str) return null;
  const [year, month] = str.split("-").map(Number);
  if (!year || !month) return null;
  return new Date(year, month - 1, 1);
}

function formatMonths(total) {
  if (total <= 0) return "0 months";
  const years  = Math.floor(total / 12);
  const months = total % 12;

  if (years === 0) return `${months} month${months !== 1 ? "s" : ""}`;
  if (months === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
}

/**
 * Returns formatted string with "+" — used in About section stats.
 * e.g. "11 months+"
 */
export function formatExperienceForDisplay(experiences) {
  return calculateTotalExperience(experiences) + "+";
}