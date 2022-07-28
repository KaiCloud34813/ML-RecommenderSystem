require("dotenv").config();
var express = require("express");
const csvParser = require("csv-parser");
const fs = require("fs");
const Python = require("python-runner");

var app = express();

const result = [];

pythonScript = "/code.py";

Python.execScript(__dirname + pythonScript, {
  bin: "python",
  args: ["argument"],
})
  .then(function (data) {
    console.log("data" + data);
    fs.createReadStream("./result.csv")
      .pipe(csvParser())
      .on("data", (data) => {
        result.push(data);
      })
      .on("end", () => {
        console.log(result);
      });
  })
  .catch(function (err) {
    console.log("Error", err);
    res.send(err);
  });

app.get("/", function (req, res) {
  res.send(result);
});

const server = app.listen(process.env.PORT, function (req, res) {
  console.log("Listening to port: " + server.address().port);
});
