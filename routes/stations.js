const fetch = require("node-fetch");
const filter = require("lodash/filter");
const includes = require("lodash/includes");
const isEqual = require("lodash/isEqual");
const orderBy = require("lodash/orderBy");
const slice = require("lodash/slice");
const isEmpty = require("lodash/isEmpty");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const accessTokenSecret = "somerandomaccesstoken";

const stationRoutes = (app, fs) => {
  const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };

  const dataPath = "./data/trip.json";

  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }
      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }
      callback();
    });
  };

  app.get("/trips/age", authenticateJWT, (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }

      let rider20 = JSON.parse('{"rider20":[]}');
      let rider30 = JSON.parse('{"rider30":[]}');
      let rider40 = JSON.parse('{"rider40":[]}');
      let rider50 = JSON.parse('{"rider50":[]}');
      let rider50plus = JSON.parse('{"rider50plus":[]}');
      let riderUnknown = JSON.parse('{"riderUnknown":[]}');

      JSON.parse(data).forEach(function (o) {
        if (
          moment(o.end_time, "YYYY-MM-DD").isSame(req.query.trip_date) &&
          includes(req.query.station_id, o.end_station_id)
        ) {
          if (moment().year() - o.member_birthday_year <= 20) {
            rider20["rider20"].push(o);
          } else if (
            moment().year() - o.member_birthday_year >= 21 &&
            moment().year() - o.member_birthday_year <= 30
          ) {
            rider30["rider30"].push(o);
          } else if (
            moment().year() - o.member_birthday_year >= 31 &&
            moment().year() - o.member_birthday_year <= 40
          ) {
            rider40["rider40"].push(o);
          } else if (
            moment().year() - o.member_birthday_year >= 41 &&
            moment().year() - o.member_birthday_year <= 50
          ) {
            rider50["rider50"].push(o);
          } else if (moment().year() - o.member_birthday_year >= 51) {
            rider50plus["rider50plus"].push(o);
          } else {
            riderUnknown["riderUnknown"].push(o);
          }
        }
      });
      let result = {
        ...rider20,
        ...rider30,
        ...rider40,
        ...rider50,
        ...rider50plus,
        ...riderUnknown,
      };
      res.send(result);
    });
  });

  app.get("/stations", authenticateJWT, (req, res) => {
    const url = "https://gbfs.divvybikes.com/gbfs/en/station_information.json";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        res.send({ data });
      })
      .catch((err) => {
        res.redirect("/error");
      });
  });

  app.get("/trips/last", authenticateJWT, (req, res) => {
    let stationVars = {};

    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      let objects = {};
      let results = [];
      req.query.station_id.forEach(function (o, index) {
        let type = "station_id_" + o;
        let temp = filter(JSON.parse(data), function (element) { return isEqual(moment(element.end_time).format("YYYY-MM-DD"),req.query.trip_date);});
        objects[o] = {[type]: slice(orderBy(filter(temp, function (element) {return isEqual(element.end_station_id, o);}),["end_time"],["desc"]),0,20),};
        results.push(objects[o]);
      });
      res.send(results);
    });
  });

  // All stations.
  app.get("/stations", authenticateJWT, (req, res) => {
    const url = "https://gbfs.divvybikes.com/gbfs/en/station_information.json";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        res.send({ data });
      })
      .catch((err) => {
        res.redirect("/error");
      });
  });

  // Stations by id.
  app.get("/stations/:id", authenticateJWT, (req, res) => {
    const url = "https://gbfs.divvybikes.com/gbfs/en/station_information.json";
    const id = req.params.id;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        res.send(
          filter(data.data.stations, function (o) {
            return o.station_id == id;
          })
        );
      })
      .catch((err) => {
        res.redirect("/error");
      });
  });
};

module.exports = stationRoutes;
