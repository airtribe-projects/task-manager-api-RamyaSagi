const taskService = require("../services/taskService");
const { parseTaskIdParam } = require("../utils/parseTaskId");

const sendValidationError = (res, errors, message = "Invalid input") => {
  return res.status(400).json({
    message,
    errors,
  });
};

const getAllTasks = (req, res) => {
  const result = taskService.getTasksWithFilters(req.query);
  if (result.validationErrors) {
    return sendValidationError(res, result.validationErrors);
  }

  return res.status(200).json(result.tasks);
};

const getTasksByPriority = (req, res) => {
  const result = taskService.getTasksByPriority(req.params.level);
  if (result.validationErrors) {
    return sendValidationError(res, result.validationErrors, "Invalid priority level");
  }

  return res.status(200).json(result.tasks);
};

const getTaskById = (req, res) => {
  const parsed = parseTaskIdParam(req.params.id);
  if (!parsed.ok) {
    return sendValidationError(res, [parsed.reason], "Invalid task id");
  }

  const task = taskService.getTaskById(parsed.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.status(200).json(task);
};

const createTask = (req, res) => {
  const result = taskService.createTask(req.body);
  if (result.validationErrors) {
    return sendValidationError(res, result.validationErrors);
  }
  if (result.message) {
    return sendValidationError(res, [result.message]);
  }

  return res.status(201).json(result.task);
};

const updateTaskById = (req, res) => {
  const parsed = parseTaskIdParam(req.params.id);
  if (!parsed.ok) {
    return sendValidationError(res, [parsed.reason], "Invalid task id");
  }

  const result = taskService.updateTaskById(parsed.id, req.body);

  if (result.notFound) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (result.validationErrors) {
    return sendValidationError(res, result.validationErrors);
  }

  return res.status(200).json(result.task);
};

const deleteTaskById = (req, res) => {
  const parsed = parseTaskIdParam(req.params.id);
  if (!parsed.ok) {
    return sendValidationError(res, [parsed.reason], "Invalid task id");
  }

  const result = taskService.deleteTaskById(parsed.id);

  if (result.notFound) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.status(200).json(result.task);
};

module.exports = {
  getAllTasks,
  getTasksByPriority,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
};
