/**
 * Parses :id route params. Rejects non-integers and unsafe values so
 * malformed IDs return 400, while valid IDs that are not in the store return 404.
 */

const parseTaskIdParam = (idParam) => {
  const raw = String(idParam ?? "").trim();

  // Rejects leading zeros (e.g., "05") and the number 0 itself.
  // Only allows "1", "10", "105", etc.
  if (!/^[1-9]\d*$/.test(raw)) {
    return { ok: false, reason: "Task id must be a positive integer without leading zeros" };
  }

  const id = Number(raw);

  if (!Number.isSafeInteger(id)) {
    return { ok: false, reason: "Task id is out of safe numeric range" };
  }

  return { ok: true, id };
};

module.exports = { parseTaskIdParam };

