const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // import auth biar amanin todos

// In-memory database (shared)
let todos = [
  { id: 1, task: "Belajar Node.js", completed: false },
  { id: 2, task: "Buat aplikasi TODO", completed: false },
];

// GET all todos (protected)
router.get("/", auth, (req, res) => {
  res.json(todos);
});

// POST create todo (protected)
router.post("/", auth, (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    task,
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT update todo (protected)
router.put("/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const { task } = req.body;
  const todoIndex = todos.findIndex((t) => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos[todoIndex].task = task;
  res.json(todos[todoIndex]);
});

// PATCH complete todo (protected)
router.patch("/:id/complete", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((t) => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos[todoIndex].completed = true;
  res.json(todos[todoIndex]);
});

// DELETE todo (protected)
router.delete("/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((t) => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos = todos.filter((t) => t.id !== id);
  res.json({ message: "Todo deleted successfully" });
});

// ✅ export router + todos
module.exports = {
  router,
  todos,
};
