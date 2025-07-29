const express = require("express");

const app = express();
const port = 3001;
app.use(express.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.use((req, res) => {
  res.status(404).render("404 - Page Not Found");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});