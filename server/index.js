const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const passport = require("passport");
const crypto = require("crypto");
const ffmpeg = require("fluent-ffmpeg");
const { AppDefaults } = require("./config");

const db = require("./db");
const appRouter = require("./router/app-router");

const app = express();
const apiPort = 3100;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    req.filename = crypto.randomBytes(64).toString("hex");
    cb(null, req.filename + ".mp4");
  },
});

var upload = multer({ storage: storage }).single("file");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/uploads", express.static("uploads"));

app.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    var videoFilePath = `${AppDefaults.BASE_PATH}/uploads/${req.filename}.mp4`;
    var thumbsFilePath = "";

    ffmpeg.ffprobe(videoFilePath, function (err, metadata) {
      if (err) console.log(err);
    });

    ffmpeg(videoFilePath)
      .on("filenames", function (filenames) {
        thumbsFilePath = `${AppDefaults.BASE_PATH}/uploads/thumbnails/${filenames[0]}`;
      })
      .on("end", function () {
        return res.status(200).send({ videoFilePath, thumbsFilePath });
      })
      .screenshot({
        count: 1,
        folder: "uploads/thumbnails",
        size: "640x480",
        filename: "thumbnail-%b.png",
      });
  });
});

require("./utils/PassportValidation")(passport);

app.use("/api", appRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
