const stationRoutes = require("./stations");

const appRouter = (app, fs) => {
  app.get("/", (req, res) => {
    res.send("welcome to the development api-server");
  });

  stationRoutes(app, fs);
};

module.exports = appRouter;
