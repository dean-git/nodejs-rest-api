const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const fs = require("fs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes/routes.js")(app, fs);

const server = app.listen(3001, () => {
  console.log("app server listening on port %s...", server.address().port);
});

module.exports = app;
