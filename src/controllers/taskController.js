// src/controllers/taskController.js
const taskModel = require("../models/taskModel");

const getAllTasks = async (req, res) => {
    try {
        // req.user.id viene del middleware 'protect'
        const tasks = await taskModel.getAllTasks(req.user.id); // <-- PASA req.user.id
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching all tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
};

const getTask = async (req, res) => {
    try {
        // req.user.id viene del middleware 'protect'
        const task = await taskModel.getTaskById(req.params.id, req.user.id); // <-- PASA req.user.id
        if (!task) {
            return res.status(404).json({ message: "Task not found or already deleted" });
        }
        res.json(task);
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        res.status(500).json({ message: "Error fetching task" });
    }
};

const createTask = async (req, res) => {
    try {
        // req.user.id viene del middleware 'protect'
        const newTask = await taskModel.createTask(req.body, req.user.id); // <-- PASA req.user.id
        res.status(201).json(newTask); // Asegúrate de que el formato de respuesta coincida con lo que espera el frontend
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Error creating task" });
    }
};

const updateTask = async (req, res) => {
    try {
        // req.user.id viene del middleware 'protect'
        const updatedTask = await taskModel.updateTask(req.params.id, req.body, req.user.id); // <-- PASA req.user.id
        if (!updatedTask) {
             return res.status(404).json({ message: "Task not found" });
        }
        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Error updating task" });
    }
};

const softDeleteTask = async (req, res) => {
    try {
        // req.user.id viene del middleware 'protect'
        const deletedTask = await taskModel.softDeleteTask(req.params.id, req.user.id); // <-- PASA req.user.id
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: 'Task marked as deleted successfully', task: deletedTask });
    } catch (error) {
        console.error("Error soft deleting task:", error);
        res.status(500).json({ message: "Error deleting task" });
    }
};

// Si tienes restoreTask y hardDeleteTask, también necesitarán req.user.id
const restoreTask = async (req, res) => {
    try {
        const restoredTask = await taskModel.restoreTask(req.params.id, req.user.id);
        if (!restoredTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: 'Task restored successfully', task: restoredTask });
    } catch (error) {
        console.error("Error restoring task:", error);
        res.status(500).json({ message: "Error restoring task" });
    }
};

const hardDeleteTask = async (req, res) => {
    try {
        const result = await taskModel.hardDeleteTask(req.params.id, req.user.id);
        res.json(result);
    } catch (error) {
        console.error("Error hard deleting task:", error);
        res.status(500).json({ message: "Error permanently deleting task" });
    }
};

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask: softDeleteTask,
    restoreTask,
    hardDeleteTask
};