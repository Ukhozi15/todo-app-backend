// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.get('/', protect, taskController.getAllTasks);
router.get('/:id', protect, taskController.getTask);
router.post('/', protect, taskController.createTask);
router.put('/:id', protect, taskController.updateTask);
router.delete('/:id', protect, taskController.deleteTask); 

module.exports = router;