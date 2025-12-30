const express = require("express");
const app = express();

app.use(express.json());

// API Routes
app.use("/api", require("./routes"));

module.exports = app;
