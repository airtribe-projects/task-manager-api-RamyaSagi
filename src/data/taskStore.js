const taskFile = require("../../task.json");
const { PRIORITY_LEVELS, isValidPriority } = require("../constants/priority");

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

const tasks = taskFile.tasks.map((task, index) => normalizeSeedTask(task, index));

const getAllTasks = () => tasks;

const getTaskById = (id) => tasks.find((task) => task.id === id);

const createTask = (taskInput) => {
  const nextId =
    taskInput.id ??
    tasks.reduce((maxId, task) => (task.id > maxId ? task.id : maxId), 0) + 1;

  const newTask = {
    id: nextId,
    title: taskInput.title,
    description: taskInput.description,
    completed: taskInput.completed,
    priority: taskInput.priority,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  return newTask;
};

const updateTaskById = (id, updates) => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return null;
  }

  const current = tasks[taskIndex];
  tasks[taskIndex] = {
    ...current,
    title: updates.title,
    description: updates.description,
    completed: updates.completed,
    priority: updates.priority !== undefined ? updates.priority : current.priority,
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
