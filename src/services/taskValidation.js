const { PRIORITY_LEVELS, isValidPriority } = require("../constants/priority");

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

  if (payload.priority !== undefined && payload.priority !== null) {
    if (!isValidPriority(payload.priority)) {
      errors.push(`priority must be one of: ${PRIORITY_LEVELS.join(", ")}`);
    }
  }

  return errors;
};

module.exports = { collectTaskBodyErrors };
