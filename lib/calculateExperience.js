/**
 * calculateExperience.js
 *
 * Given an array of experience documents from MongoDB,
 * calculates the total professional experience duration.
 *
 * Rules:
 *  - If isCurrent === true, endDate is treated as today
 *  - Overlapping periods are NOT deduplicated (simple sum)
 *  - Result is formatted as "X year Y months" or "X months"
 */

/**
 * @param {Array} experiences - Array of experience objects
 * @param {string} experiences[].startDate - "YYYY-MM" format
 * @param {string|null} experiences[].endDate - "YYYY-MM" format or null
 * @param {boolean} experiences[].isCurrent - true if still working here
 * @returns {string} - Formatted duration string e.g. "1 year 5 months"
 */
export function calculateTotalExperience(experiences) {
  if (!experiences || experiences.length === 0) return "0 months";

  let totalMonths = 0;

  for (const exp of experiences) {
    const start = parseYearMonth(exp.startDate);
    if (!start) continue;

    const end =
      exp.isCurrent || !exp.endDate ? new Date() : parseYearMonth(exp.endDate);
    if (!end) continue;

    // Calculate difference in months
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (months > 0) {
      totalMonths += months;
    }
  }

  return formatMonths(totalMonths);
}

/**
 * Parse "YYYY-MM" string into a Date object (1st of that month)
 */
function parseYearMonth(str) {
  if (!str) return null;
  const [year, month] = str.split("-").map(Number);
  if (!year || !month) return null;
  return new Date(year, month - 1, 1);
}

/**
 * Format total months into readable string
 * < 12  → "X months"
 * >= 12 → "X year Y months" or "X years Y months"
 */
function formatMonths(total) {
  if (total <= 0) return "0 months";

  const years = Math.floor(total / 12);
  const months = total % 12;

  if (years === 0) {
    return `${months} month${months !== 1 ? "s" : ""}`;
  }

  if (months === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  }

  return `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
}

/**
 * Format for display in the About section (e.g. "10+ months")
 * Adds "+" suffix
 */
export function formatExperienceForDisplay(experiences) {
  const raw = calculateTotalExperience(experiences);
  return `${raw}+`;
}