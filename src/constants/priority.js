const PRIORITY_LEVELS = ["low", "medium", "high"];

const isValidPriority = (value) =>
  typeof value === "string" && PRIORITY_LEVELS.includes(value);

module.exports = {
  PRIORITY_LEVELS,
  isValidPriority,
};
