const { PRIORITY_LEVELS, isValidPriority } = require("../constants/priority");

/** Only these JSON keys may appear on PUT /tasks/:id */
const ALLOWED_UPDATE_FIELD_SET = new Set(["title", "description", "completed", "priority"]);

const collectDisallowedUpdateFieldErrors = (payload) => {
  if (payload === null || payload === undefined) {
    return [];
  }

  if (typeof payload !== "object" || Array.isArray(payload)) {
    return [];
  }

  const unknownKeys = Object.keys(payload).filter((key) => !ALLOWED_UPDATE_FIELD_SET.has(key));
  if (unknownKeys.length === 0) {
    return [];
  }

  const allowedList = [...ALLOWED_UPDATE_FIELD_SET].sort().join(", ");
  return [
    `Only these fields may be updated: ${allowedList}. Remove: ${unknownKeys.sort().join(", ")}`,
  ];
};

/**
 * Validates a PATCH-style task body: only keys present on the object are checked;
 * at least one updatable field must be sent.
 */
const collectPartialTaskUpdateErrors = (payload) => {
  const errors = [];

  if (payload === null || payload === undefined) {
    return ["Request body is required"];
  }

  if (typeof payload !== "object" || Array.isArray(payload)) {
    return ["Request body must be a JSON object"];
  }

  const hasKey = (key) => Object.prototype.hasOwnProperty.call(payload, key);

  const hasAnyUpdate =
    hasKey("title") ||
    hasKey("description") ||
    hasKey("completed") ||
    hasKey("priority");

  if (!hasAnyUpdate) {
    errors.push("Provide at least one of: title, description, completed, priority");
  }

  if (hasKey("title")) {
    if (typeof payload.title !== "string" || payload.title.trim() === "") {
      errors.push("title must be a non-empty string");
    }
  }

  if (hasKey("description")) {
    if (typeof payload.description !== "string" || payload.description.trim() === "") {
      errors.push("description must be a non-empty string");
    }
  }

  if (hasKey("completed")) {
    if (typeof payload.completed !== "boolean") {
      errors.push("completed must be a boolean");
    }
  }

  if (hasKey("priority")) {
    if (payload.priority !== null && !isValidPriority(payload.priority)) {
      errors.push(`priority must be one of: ${PRIORITY_LEVELS.join(", ")}`);
    }
  }

  return errors;
};

const collectTaskBodyErrors = (payload) => {
  const errors = [];

  if (payload === null || payload === undefined) {
    return ["Request body is required"];
  }

  if (typeof payload !== "object" || Array.isArray(payload)) {
    return ["Request body must be a JSON object"];
  }

  if (typeof payload.title !== "string" || payload.title.trim() === "") {
    errors.push("title must be a non-empty string");
  }

  if (typeof payload.description !== "string" || payload.description.trim() === "") {
    errors.push("description must be a non-empty string");
  }

  if (typeof payload.completed !== "boolean") {
    errors.push("completed must be a boolean");
  }

  if (payload.priority !== null && !isValidPriority(payload.priority)) {
    if (!isValidPriority(payload.priority)) {
      errors.push(`priority must be one of: ${PRIORITY_LEVELS.join(", ")}`);
    }
  }

  return errors;
};

module.exports = {
  collectTaskBodyErrors,
  collectDisallowedUpdateFieldErrors,
  collectPartialTaskUpdateErrors,
};
