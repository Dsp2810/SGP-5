const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", require("./routes"));

module.exports = app;
