const fs = require("fs");
const multer = require("multer");
const uniqueString = require("unique-string");
//const ffmpeg = require("fluent-ffmpeg");
const { AppDefaults } = require("../config");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads/${req.type}`);
  },
  filename: function (req, file, cb) {
    req.filename = uniqueString();
    cb(null, req.filename + req.filetype);
  },
});

var upload = multer({ storage: storage }).single("file");

const uploadCourseImage = (req, res) => {
  req.filetype = ".jpg";
  req.type = "images";
  return upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    } else {
      return res.status(200).json({
        success: true,
        data: {
          path: `${AppDefaults.BASE_PATH}/uploads/images/${req.filename}.jpg`,
        },
      });
    }
  });
};

const uploadHTMLContent = (req, res) => {
  const filename = uniqueString() + ".html";
  const filepath = "./uploads/docs/" + filename;
  console.log(req.body);
  fs.writeFileSync(filepath, req.body.content, (err) => {
    return res.status(500).json(err);
  });

  return res.status(200).json({
    success: true,
    data: {
      path: `${AppDefaults.BASE_PATH}/uploads/docs/${filename}`,
    },
  });
};

module.exports = {
  uploadCourseImage,
  uploadHTMLContent,
};
