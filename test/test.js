var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
describe("stations", function () {
  describe("Read Operations", function () {
    it("Should Fetch all the Stations", (done) => {
      var token = jwt.sign(
        {
          id: 1,
        },
        "somerandomaccesstoken",
        { expiresIn: 60 * 60 }
      );

      chai
        .request(server)
        .get("/stations")
        .set("Authorization", `Bearer ${token}`)
        .end((err, result) => {
          result.should.have.status(200);
          console.log(
            "Retrieved",
            result.body.data.data.stations.length,
            " stations."
          );
          console.log("Result Body:", result.body);
          done();
        });
    });

    it("Should Fetch Station by id", (done) => {
      let token = jwt.sign(
        {
          id: 1,
        },
        "somerandomaccesstoken",
        { expiresIn: 60 * 60 }
      );
      let stationId = 2;
      chai
        .request(server)
        .get("/stations/" + stationId)
        .set("Authorization", `Bearer ${token}`)
        .end((err, result) => {
          result.should.have.status(200);
          console.log("Retrieved", result.body.length, " station.");
          console.log("Result Body:", result.body);
          done();
        });
    });
  });
});
