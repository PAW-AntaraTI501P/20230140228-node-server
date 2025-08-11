const express = require("express");
const router = express.Router();

// In-memory database (shared)
let todos = [
  { id: 1, task: "Belajar Node.js", completed: false },
  { id: 2, task: "Buat aplikasi TODO", completed: false },
];

// GET all todos
router.get("/", (req, res) => {
  res.json(todos);
});

// POST create todo
router.post("/", (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    task,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT update todo
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { task } = req.body;
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos[todoIndex].task = task;
  res.json(todos[todoIndex]);
});

// PATCH complete todo
router.patch("/:id/complete", (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos[todoIndex].completed = true;
  res.json(todos[todoIndex]);
});

// DELETE todo
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos = todos.filter(t => t.id !== id);
  res.json({ message: "Todo deleted successfully" });
});

module.exports = router;
module.exports.todos = todos;
