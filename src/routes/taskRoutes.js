const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

router.get("/tasks", taskController.getAllTasks);
router.get("/tasks/priority/:level", taskController.getTasksByPriority);
router.get("/tasks/:id", taskController.getTaskById);
router.post("/tasks", taskController.createTask);
router.put("/tasks/:id", taskController.updateTaskById);
router.delete("/tasks/:id", taskController.deleteTaskById);

module.exports = router;
