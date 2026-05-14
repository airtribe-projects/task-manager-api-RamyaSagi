/**
 * Parses :id route params. Rejects non-integers and unsafe values so
 * malformed IDs return 400, while valid IDs that are not in the store return 404.
 */
const parseTaskIdParam = (idParam) => {
  const raw = String(idParam ?? "").trim();
  if (raw === "" || !/^\d+$/.test(raw)) {
    return { ok: false, reason: "Task id must be a non-negative integer" };
  }
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id < 0) {
    return { ok: false, reason: "Task id is invalid or out of range" };
  }
  return { ok: true, id };
};

module.exports = { parseTaskIdParam };
