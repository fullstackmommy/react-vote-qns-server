const express = require("express");
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.static('public'))
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/api/v1/events", require("./routes/events"));

module.exports = app;
