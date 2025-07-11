// src/models/taskModel.js
const pool = require('../config/db');

const getAllTasks = async (userId) => { // <-- RECIBE userId
    const [rows] = await pool.query('SELECT * FROM tasks WHERE is_deleted = FALSE AND user_id = ?', [userId]); // <-- USA userId
    return rows;
};

const getTaskById = async (id, userId) => { // <-- RECIBE userId
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND is_deleted = FALSE AND user_id = ?', [id, userId]); // <-- USA userId
    return rows[0];
};

const createTask = async (task, userId) => { // <-- RECIBE userId
    const { title, description, status } = task;
    // <-- INSERTA user_id
    const [result] = await pool.query('INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)', [title, description, status, userId]);
    // Asegúrate de que la respuesta del modelo incluya user_id
    return { id: result.insertId, title, description, status, is_deleted: false, user_id: userId };
};

const updateTask = async (id, task, userId) => { // <-- RECIBE userId
    const { title, description, status } = task;
    // <-- ACTUALIZA FILTRANDO POR user_id
    await pool.query('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?', [title, description, status, id, userId]);
    // Recupera la tarea completa para devolverla con is_deleted y user_id
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0];
};

const softDeleteTask = async (id, userId) => { // <-- RECIBE userId
    // <-- ACTUALIZA FILTRANDO POR user_id
    await pool.query('UPDATE tasks SET is_deleted = TRUE WHERE id = ? AND user_id = ?', [id, userId]);
    // Recupera la tarea completa para devolverla con is_deleted y user_id
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0];
};

// Si tienes restoreTask y hardDeleteTask, también necesitarán userId
const restoreTask = async (id, userId) => {
    await pool.query('UPDATE tasks SET is_deleted = FALSE WHERE id = ? AND user_id = ?', [id, userId]);
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0];
};

const hardDeleteTask = async (id, userId) => {
    await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    return { message: 'Task permanently deleted successfully' };
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    softDeleteTask,
    restoreTask,
    hardDeleteTask
};