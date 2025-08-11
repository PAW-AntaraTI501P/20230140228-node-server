const methodOverride = require("method-override");
const express = require("express");
const app = express();
const cors = require("cors");
//const port = 3001;
require("dotenv").config();
const port = process.env.PORT;

const todoRoutes = require("./routes/todo.js");
const { todos } = require("./routes/todo.js");

//middleware untuk parsing json dan form
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.json());
app.use("/todos", todoRoutes);

// atur EJS sebagai view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index"); // render file index.ejs
});

app.get("/contact", (req, res) => {
res.render("contact");
});

//endpoint untuk mendapatkan data todos
app.get("/todos-data", (req, res) =>{
  res.json(todos); // mengembalikan data todos dalam format json
})

// GET untuk halaman daftar tugas
app.get("/todos-list", (req, res) => {
  res.render("todos-page", { todos });
});

// POST tambah data
app.post("/todos-list/add", (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === "") {
    return res.status(400).send("Task tidak boleh kosong");
  }

  const newTodo = {
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    task: task.trim()
  };
  todos.push(newTodo);

  res.redirect("/todos-list");
});


// PUT update data
app.put("/todos-list/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { task } = req.body;
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).send("Tugas tidak ditemukan");
  }
  if (!task || task.trim() === "") {
    return res.status(400).send("Task tidak boleh kosong");
  }

  todo.task = task.trim();
  res.redirect("/todos-list");
});

// DELETE hapus data
app.delete("/todos-list/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).send("Tugas tidak ditemukan");
  }

  todos.splice(index, 1);
  res.redirect("/todos-list");
});

//middleware
app.use((req, res) => {
res.status(404).send("404 - page not found");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});