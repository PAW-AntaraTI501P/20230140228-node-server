require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./database/db.js");

const todoRoutes = require("./routes/tododb.js");
const { todos } = require("./routes/todo.js");
const port = process.env.PORT;
const methodOverride = require("method-override");

const expressLayout = require("express-ejs-layouts");
app.use(expressLayout);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/todos", todoRoutes);

app.set("view engine", "ejs"); //utk ke halaman ejs

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
  }); //render file ke index.ejs
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    layout: "layouts/main-layout",
  }); //render ke file contact.ejs
});

app.get("/todos-data", (req, res) => {
  res.json(todos);
});
app.get("/todos-list", (req, res) => {
  res.render("todos-page", { todos: todos, layout: "layouts/main-layout" });
});
app.post("/todos-list/add", (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === "") {
    return res.status(400).send("Task tidak boleh kosong");
  }

  const newTodo = {
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    task: task.trim(),
  };
  todos.push(newTodo);

  res.redirect("/todos-list");
});

app.put("/todos-list/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { task } = req.body;
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).send("Tugas tidak ditemukan");
  }
  if (!task || task.trim() === "") {
    return res.status(400).send("Task tidak boleh kosong");
  }

  todo.task = task.trim();
  res.redirect("/todos-list");
});

app.delete("/todos-list/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).send("Tugas tidak ditemukan");
  }

  todos.splice(index, 1);
  res.redirect("/todos-list");
});

app.get("/todo-view", (req, res) => {
  db.query("SELECT * from todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo", {
      todos: todos,
      layout: "layouts/main-layout",
    });
  });
});

app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});