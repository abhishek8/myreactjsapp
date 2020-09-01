const Course = require("../models/course");
const Rating = require("../models/rating");
const User = require("../models/user");
const url = require("url");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const { AppDefaults } = require("../config");

const getCourses = async (req, res) => {
  const { genre, status } = url.parse(req.url, true).query;
  var query = {};
  if (genre) query["genre"] = genre;
  query["status"] = status ? status : "ACTIVE";

  await Course.find(query, async (err, courses) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!courses.length) {
      return res.status(200).json({ success: false, error: `No course found` });
    }

    const data = await Promise.all(
      courses.map((course) => serializedCourse(course))
    );

    return res.status(200).json({ success: true, data: data });
  }).catch((err) => console.log(err));
};

const getCoursesByAuthor = async (req, res) => {
  await Course.find({ authorId: req.user._id }, async (err, courses) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!courses.length) {
      return res.status(200).json({ success: false, error: `No course found` });
    }

    const data = await Promise.all(
      courses.map((course) => serializedCourse(course))
    );

    return res.status(200).json({ success: true, data: data });
  }).catch((err) => console.log(err));
};

const getUserPurchasedCourses = async (req, res) => {
  Course.find(
    { _id: { $in: req.user.subscriptions } },
    async (err, courses) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      if (!courses.length) {
        return res
          .status(200)
          .json({ success: false, error: `No course found` });
      }

      const data = await Promise.all(
        courses.map((course) => serializedCourse(course))
      );

      return res.status(200).json({ success: true, data: data });
    }
  ).catch((err) => console.log(err));
};

const getCourseDetails = async (req, res) => {
  Course.findOne({ _id: req.params.id }, async (err, course) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        error: `Course with ${req.params.id} not found`,
      });
    }

    if (req.user.role === "trainer" && course.authorId != req.user._id) {
      return res.status(401).json({
        success: false,
        error: `This isn't your course. To view this course log in as a user`,
      });
    }

    var data = await serializedCourse(course);
    data["description"] = course.description;

    return res.status(200).json({ success: true, data: data });
  }).catch((err) => console.log(err));
};

const getUnverifiedCourses = async (req, res) => {
  Course.find(
    {
      status: "COMPLETED",
    },
    async (err, courses) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      const data = await Promise.all(
        courses.map((course) => serializedCourse(course))
      );

      return res.status(200).json({ success: true, data: data });
    }
  ).catch((err) => console.log(err));
};

const getReviewedCourses = async (req, res) => {
  Course.find(
    {
      "verification.verificationId": req.user._id.toString(),
    },
    async (err, courses) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      const data = await Promise.all(
        courses.map((course) => serializedCourse(course))
      );

      return res.status(200).json({ success: true, data: data });
    }
  ).catch((err) => console.log(err));
};

const serializedCourse = async (course) => {
  var total_count = 0,
    avg_rating = 0;

  const author = await User.findOne({ _id: course.authorId });

  var rating = await Rating.aggregate([
    { $match: { courseId: course._id.toString() } },
    {
      $project: {
        numFive: { $size: "$fiveStar" },
        numFour: { $size: "$fourStar" },
        numThree: { $size: "$threeStar" },
        numTwo: { $size: "$twoStar" },
        numOne: { $size: "$oneStar" },
      },
    },
  ]).exec();

  const doc = rating[0];
  if (doc) {
    total_count =
      doc.numFive + doc.numFour + doc.numThree + doc.numTwo + doc.numOne;
    avg_rating =
      (doc.numFive * 5 +
        doc.numFour * 4 +
        doc.numThree * 3 +
        doc.numTwo * 2 +
        doc.numOne) /
      total_count;
  }

  const data = {
    _id: course._id,
    title: course.title,
    genre: course.genre,
    courseLink: course.courseLink,
    thumbnail: course.thumbnail
      ? course.thumbnail
      : AppDefaults.BRAND_THUMBNAIL,
    publishedDate: course.publishedDate,
    credits: course.credits,
    ratings: {
      total_count,
      avg_rating,
    },
    author: {
      name: author.name,
      email: author.email,
    },
    status: course.status,
    section: course.section,
  };

  return data;
};

const createCourse = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide course details",
    });
  }

  const course = new Course(body);
  course.authorId = req.user._id;
  course.status = "CREATED";
  if (!course) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid course information" });
  }

  course
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: course._id,
        message: "Course created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Course not created!",
      });
    });
};

const verifyCourse = (req, res) => {
  const body = req.body;

  Course.findOne({ _id: body.courseId }, (err, course) => {
    course.verification["status"] = true;
    course.status = body.status ? "ACTIVE" : "REJECTED";
    course.verification["verificationId"] = req.user._id;
    course.publishedDate = new Date();

    course
      .save()
      .then(() => {
        if (body.status) {
          // Send Course Approved Email
        } else {
          // Send Course Rejected Email
        }

        return res.status(200).json({
          success: true,
          id: course._id,
          message: "Course updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Course not updated!",
        });
      });
  });
};

const updateCourseDetails = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide information to update",
    });
  }

  Course.findOne(
    { _id: req.params.id, authorId: req.user._id },
    (err, course) => {
      if (err) {
        return res.status(404).json({
          err,
          message: "Course not found!",
        });
      }

      if (course.status === "COMPLETED") {
        return res.status(400).json({
          success: false,
          message: "Course submitted for review cannot be updated.",
        });
      }

      if (body.title) course.title = body.title;
      if (body.genre) course.genre = body.genre;
      if (body.courseLink) course.courseLink = body.courseLink;
      if (body.credits && body.credits.criteria)
        course.credits["criteria"] = body.credits["criteria"];
      if (body.credits && body.credits.score)
        course.credits["score"] = body.credits["score"];
      if (body.thumbnail) course.thumbnail = body.thumbnail;
      if (body.section) course.section = body.section;
      if (course.status !== "CREATED") course.status = "COMPLETED";

      course
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: course._id,
            message: "Course updated!",
          });
        })
        .catch((error) => {
          return res.status(404).json({
            error,
            message: "Course not updated!",
          });
        });
    }
  );
};

const deactivateCourse = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide information to update",
    });
  }

  Course.findOne(
    { _id: req.params.id, authorId: req.user._id },
    (err, course) => {
      if (err) {
        return res.status(404).json({
          err,
          message: "Course not found!",
        });
      }

      if (course.status !== "ACTIVE") {
        return res.status(400).json({
          err,
          message: "Course is not active!",
        });
      }

      course.status = "DEACTIVATED";

      course
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: course._id,
            message: "Course Deactivated!",
          });
        })
        .catch((error) => {
          return res.status(500).json({
            error,
            message: "Unable to deactivate! Please try again.",
          });
        });
    }
  );
};

const submitCourseForReview = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide information to update",
    });
  }

  Course.findOne(
    { _id: req.params.id, authorId: req.user._id },
    (err, course) => {
      if (err) {
        return res.status(404).json({
          err,
          message: "Course not found!",
        });
      }

      if (body.title) course.title = body.title;
      if (body.genre) course.genre = body.genre;
      if (body.courseLink) course.courseLink = body.courseLink;
      if (body.credits && body.credits.criteria)
        course.credits["criteria"] = body.credits["criteria"];
      if (body.credits && body.credits.score)
        course.credits["score"] = body.credits["score"];
      if (body.thumbnail) course.thumbnail = body.thumbnail;
      if (body.section) course.section = body.section;
      course.status = "COMPLETED";

      course
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: course._id,
            message: "Course updated!",
          });
        })
        .catch((error) => {
          return res.status(404).json({
            error,
            message: "Course not updated!",
          });
        });
    }
  );
};

const removeFiles = async (path) => {
  try {
    if (path && path.startsWith(AppDefaults.BASE_PATH))
      await unlinkAsync(
        "../server/" + course.courseLink.replace(AppDefaults.BASE_PATH, "")
      );
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
};

const deleteCourse = async (req, res) => {
  Course.findOneAndDelete(
    {
      _id: req.params.id,
      authorId: req.user._id,
      status: { $in: ["CREATED", "COMPLETED"] },
    },
    async (err, course) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!course) {
        return res.status(404).json({
          success: false,
          error: `Either course doesn't exists or you are not authorized to delete this course. Note published courses could only be deactivated and will not be deleted.`,
        });
      }
      course.section.forEach((sect) => {
        sect.contentList.forEach((content) => {
          removeFiles(content.sourceLinks.videosrc);
          removeFiles(content.sourceLinks.thumbnail);
          removeFiles(content.sourceLinks.contentsrc);
        });
      });

      return res.status(200).json({ success: true, data: course });
    }
  ).catch((err) => console.log(err));
};

module.exports = {
  getCourses,
  getCoursesByAuthor,
  getUserPurchasedCourses,
  getCourseDetails,
  getUnverifiedCourses,
  getReviewedCourses,
  createCourse,
  verifyCourse,
  updateCourseDetails,
  submitCourseForReview,
  deactivateCourse,
  deleteCourse,
};
