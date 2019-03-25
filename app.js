const express = require("express");

const app = express();

app.use(express.json());

// routes
app.use("/", require("./routes/index"));
app.use("/api/v1/questions", require("./routes/questions"));

module.exports = app;
