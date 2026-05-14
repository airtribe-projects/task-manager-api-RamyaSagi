const taskStore = require("../data/taskStore");
const { collectTaskBodyErrors } = require("./taskValidation");
const { filterAndSortTasks } = require("./taskQuery");
const { PRIORITY_LEVELS, isValidPriority } = require("../constants/priority");

const getBodyValidationResult = (payload) => {
  const errors = collectTaskBodyErrors(payload);
  if (errors.length > 0) {
    return { validationErrors: errors };
  }
  return null;
};

const resolvePriorityForCreate = (payload) =>
  payload.priority !== undefined && payload.priority !== null
    ? payload.priority
    : "medium";

const getTasksWithFilters = (query) =>
  filterAndSortTasks(taskStore.getAllTasks(), query);

const getTasksByPriority = (level) => {
  const normalized = String(level ?? "").trim().toLowerCase();
  if (!isValidPriority(normalized)) {
    return {
      validationErrors: [`priority level must be one of: ${PRIORITY_LEVELS.join(", ")}`],
    };
  }

  const matching = taskStore.getAllTasks().filter((task) => task.priority === normalized);
  return filterAndSortTasks(matching, {});
};

const getAllTasks = () => taskStore.getAllTasks();

const getTaskById = (id) => taskStore.getTaskById(id);

const createTask = (payload) => {
  const invalid = getBodyValidationResult(payload);
  if (invalid) {
    return invalid;
  }

  if (payload.id !== undefined && !Number.isInteger(payload.id)) {
    return { message: "Optional id must be an integer" };
  }

  if (payload.id !== undefined && taskStore.getTaskById(payload.id)) {
    return { message: "Task id already exists" };
  }

  const taskToPersist = {
    ...payload,
    priority: resolvePriorityForCreate(payload),
  };

  return { task: taskStore.createTask(taskToPersist) };
};

const updateTaskById = (id, payload) => {
  const existing = taskStore.getTaskById(id);
  if (!existing) {
    return { notFound: true };
  }

  const invalid = getBodyValidationResult(payload);
  if (invalid) {
    return invalid;
  }

  const merged = {
    title: payload.title,
    description: payload.description,
    completed: payload.completed,
    priority:
      payload.priority !== undefined && payload.priority !== null
        ? payload.priority
        : existing.priority,
  };

  return { task: taskStore.updateTaskById(id, merged) };
};

const deleteTaskById = (id) => {
  const deletedTask = taskStore.deleteTaskById(id);
  if (!deletedTask) {
    return { notFound: true };
  }

  return { task: deletedTask };
};

module.exports = {
  getTasksWithFilters,
  getTasksByPriority,
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
};
