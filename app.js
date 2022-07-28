require("dotenv").config();
var express = require("express");
const csvParser = require("csv-parser");
const fs = require("fs");
const Python = require("python-runner");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const result = [];
const result2 = [];

// const result3=[];

pythonScript = "/code.py";
pythonScript2 = "/code2.py";

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

app.post("/", function (req, res) {
  process.env["TITLE"] = req.body.title;

  console.log("this is our env variable", process.env["TITLE"]);
  Python.execScript(__dirname + pythonScript2, {
    bin: "python",
    args: [req.body.title],
  })
    .then(function (data) {
      console.log("data" + data);
      fs.createReadStream("./result2.csv")
        .pipe(csvParser())
        .on("data", (data) => {
          result2.push(data);
        })
        .on("end", () => {
          console.log(result2);
          result2.push(data);
          res.send(result2);
        });
    })
    .catch(function (err) {
      console.log("Error", err);
      res.send(err);
    });
});

const server = app.listen(process.env.PORT, function (req, res) {
  console.log("Listening to port: " + server.address().port);
});
