const PRIORITY_LEVELS = ["low", "medium", "high"];

/** Default when no priority is supplied; always an element of PRIORITY_LEVELS. */
const DEFAULT_TASK_PRIORITY = PRIORITY_LEVELS[1];

const isValidPriority = (value) =>
  typeof value === "string" && PRIORITY_LEVELS.includes(value);

module.exports = {
  PRIORITY_LEVELS,
  DEFAULT_TASK_PRIORITY,
  isValidPriority,
};
