const Course = require("../models/course");
const Rating = require("../models/rating");
const User = require("../models/user");
const url = require("url");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const { AppDefaults } = require("../config");

const getCourses = async (req, res) => {
  const { genre, verified } = url.parse(req.url, true).query;
  var query = {};
  if (genre) query["genre"] = genre;
  query["verification.status"] = verified ? verified : true;
  // Search by credits
  // Search by ratings
  // Pagination, sorting and offsets

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

    if (!course.verification.status && course.authorId != req.user._id) {
      return res.status(400).json({
        success: false,
        error: `Course has not been verified yet`,
      });
    }

    var data = await serializedCourse(course);

    return res.status(200).json({ success: true, data: data });
  }).catch((err) => console.log(err));
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
  if (!course.courseLink)
    course.courseLink = `${AppDefaults.BASE_PATH}/uploads/${course._id}.mp4`;
  course.authorId = req.user._id;

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
    course.verification["status"] = body.status;
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

const updateCourseRatings = async (req, res) => {
  const body = req.body;
  const userId = req.user._id;

  Rating.findOne({ courseId: body.courseId }, (err, rating) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!rating) {
      rating = new Rating({ courseId: body.courseId });
      rating.fiveStar = rating.fourStar = rating.threeStar = rating.twoStar = rating.oneStar = [];
    }

    rating.fiveStar.splice(rating.fiveStar.indexOf(userId), 1);
    rating.fourStar.splice(rating.fourStar.indexOf(userId), 1);
    rating.threeStar.splice(rating.threeStar.indexOf(userId), 1);
    rating.twoStar.splice(rating.twoStar.indexOf(userId), 1);
    rating.oneStar.splice(rating.oneStar.indexOf(userId), 1);

    switch (body.rating_value) {
      case 5:
        rating.fiveStar.push(userId);
        break;
      case 4:
        rating.fourStar.push(userId);
        break;
      case 3:
        rating.threeStar.push(userId);
        break;
      case 2:
        rating.twoStar.push(userId);
        break;
      case 1:
        rating.oneStar.push(userId);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid rating value!",
        });
    }

    rating
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: rating._id,
          message: "Course rated successfuly!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Unable to provide your rating!",
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

      if (body.title) course.title = body.title;
      if (body.genre) course.genre = body.genre;
      if (body.courseLink) course.courseLink = body.courseLink;
      if (body.credits && body.credits.criteria)
        course.credits["criteria"] = body.credits["criteria"];
      if (body.credits && body.credits.score)
        course.credits["score"] = body.credits["score"];
      if (body.thumbnail) course.thumbnail = body.thumbnail;

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

const deleteCourse = async (req, res) => {
  Course.findOneAndDelete(
    { _id: req.params.id, authorId: req.user._id },
    async (err, course) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      if (!course) {
        return res.status(404).json({
          success: false,
          error: `Either course doesn't exists or you are not authorized to delete this course.`,
        });
      }

      if (course.courseLink.startsWith(AppDefaults.BASE_PATH))
        await unlinkAsync("../server/uploads/" + req.params.id + ".mp4");

      return res.status(200).json({ success: true, data: course });
    }
  ).catch((err) => console.log(err));
};

module.exports = {
  getCourses,
  getCoursesByAuthor,
  getUserPurchasedCourses,
  getCourseDetails,
  createCourse,
  verifyCourse,
  updateCourseRatings,
  updateCourseDetails,
  deleteCourse,
};
