const taskFile = require("../../task.json");
const { PRIORITY_LEVELS, DEFAULT_TASK_PRIORITY, isValidPriority } = require("../constants/priority");

const seedPriorityForIndex = (index) => PRIORITY_LEVELS[index % PRIORITY_LEVELS.length];

const seedCreatedAtForIndex = (index) =>
  new Date(Date.UTC(2024, 0, 1 + index, 12, 0, 0)).toISOString();

const normalizeSeedTask = (task, index) => ({
  ...task,
  priority: isValidPriority(task.priority) ? task.priority : seedPriorityForIndex(index),
  createdAt:
    typeof task.createdAt === "string" && !Number.isNaN(Date.parse(task.createdAt))
      ? task.createdAt
      : seedCreatedAtForIndex(index),
});

const rawTasks = taskFile.tasks;
if (!Array.isArray(rawTasks)) {
  throw new Error('Invalid task.json: root "tasks" must be an array');
}

const tasks = rawTasks.map((task, index) => normalizeSeedTask(task, index));

const getAllTasks = () => tasks;

const getTaskById = (id) => tasks.find((task) => task.id === id);

const createTask = (taskInput) => {
  const errors = [];

  if (taskInput === null || taskInput === undefined) {
    return { ok: false, errors: ["Request body is required"] };
  }

  if (typeof taskInput !== "object" || Array.isArray(taskInput)) {
    return { ok: false, errors: ["Request body must be a JSON object"] };
  }

  const title = typeof taskInput.title === "string" ? taskInput.title.trim() : "";
  const description =
    typeof taskInput.description === "string" ? taskInput.description.trim() : "";

  if (!title) {
    errors.push("title must be a non-empty string");
  }
  if (!description) {
    errors.push("description must be a non-empty string");
  }

  let completed = taskInput.completed;
  if (completed === undefined || completed === null) {
    completed = false;
  } else if (typeof completed !== "boolean") {
    errors.push("completed must be a boolean");
  }

  let priority = taskInput.priority;
  if (priority === undefined || priority === null || priority === "") {
    priority = DEFAULT_TASK_PRIORITY;
  } else if (typeof priority !== "string" || !isValidPriority(priority)) {
    errors.push(`priority must be one of: ${PRIORITY_LEVELS.join(", ")}`);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const nextId =
    taskInput.id ??
    tasks.reduce((maxId, task) => (task.id > maxId ? task.id : maxId), 0) + 1;

  const newTask = {
    id: nextId,
    title,
    description,
    completed,
    priority,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  return { ok: true, task: newTask };
};

/** Only reads title, description, completed, priority; unknown keys are ignored (PUT body is validated in taskService). */
const updateTaskById = (id, updates) => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return null;
  }

  const current = tasks[taskIndex];
  tasks[taskIndex] = {
    ...current,
    title: updates.title !== undefined ? updates.title : current.title,
    description: updates.description !== undefined ? updates.description : current.description,
    completed: updates.completed !== undefined ? updates.completed : current.completed,
    priority:
      updates.priority != null
        ? updates.priority
        : current.priority,
    createdAt: current.createdAt,
  };

  return tasks[taskIndex];
};

const deleteTaskById = (id) => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return null;
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);
  return deletedTask;
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
};
