/**
 * Parses :id route params. Rejects non-integers and unsafe values so
 * malformed IDs return 400, while valid IDs that are not in the store return 404.
 */

const parseTaskIdParam = (idParam) => {
  const raw = String(idParam ?? "").trim();

  // Only allows positive integers: "1", "10", "105", etc.
  // Rejects empty strings, non-numeric input, leading zeros, and zero itself.
  if (!/^[1-9]\d*$/.test(raw)) {
    return { ok: false, reason: "Task id must be a positive integer without leading zeros and not empty" };
  }

  const id = Number(raw);

  if (!Number.isSafeInteger(id)) {
    return { ok: false, reason: "Task id is out of safe numeric range" };
  }

  return { ok: true, id };
};

module.exports = { parseTaskIdParam };
