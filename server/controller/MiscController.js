const Transaction = require("../models/transaction");
const User = require("../models/user");
const Course = require("../models/course");
const Rating = require("../models/rating");
const Category = require("../models/category");

const getCategories = (req, res) => {
  Category.find({}, (err, categories) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!categories.length) {
      return res
        .status(200)
        .json({ success: false, error: `No categories found` });
    }

    return res.status(200).json({ success: true, data: categories });
  }).catch((err) => console.log(err));
};

const courseTransaction = async (req, res) => {
  var body = req.body;
  var total_credits = 0;
  var courseList = [];

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide transaction details",
    });
  }

  for (const item of body.items) {
    if (req.user.subscriptions.includes(item.courseId)) {
      return res.status(400).json({
        success: false,
        error: `Course with ${item.courseId} is already purchased`,
      });
    }

    const course = await Course.findOne({
      _id: item.courseId,
      "credits.criteria": item.credit,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: `Course with ${item.courseId} not found`,
      });
    }

    total_credits += course.credits.criteria;
    courseList.push(item.courseId);
  }

  body = { ...body, userId: req.user._id, purchaseDate: new Date() };
  const transact = new Transaction(body);

  if (!transact) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid transaction values!" });
  }

  if (req.user.creditBalance < total_credits) {
    return res.status(400).json({
      success: false,
      error: `Insufficient Balance. You are not eligible to avail this course.`,
    });
  }

  transact
    .save()
    .then(() => {
      const user = new User(req.user);
      user.creditBalance = user.creditBalance - total_credits;
      user.subscriptions = user.subscriptions
        ? user.subscriptions.concat(courseList)
        : courseList;
      user.history.purchase = user.history.purchase
        ? user.history.purchase
        : [];
      user.history.purchase.push(transact._id);

      user
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: transact._id,
            message: "Transaction successfull!",
          });
        })
        .catch((error) => {
          return res.status(404).json({
            error,
            message: "Transaction Failed --saving user!",
          });
        });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Transaction failed --saving transaction!",
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
      .then(async () => {
        const course = await Course.findOne({ _id: body.courseId });
        var user = new User(req.user);
        user.creditBalance = user.creditBalance + course.credits.score;
        user
          .save()
          .then(() => {
            return res.status(200).json({
              success: true,
              id: rating._id,
              message:
                "Course rated successfully! Credits points added to user.",
            });
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({
              error,
              message: "Course has been rated but credit could not be awarded.",
            });
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

const setCourseWatched = (req, res) => {
  Course.findOne({ _id: req.params.id }, (err, course) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        error: `Course with ${req.params.id} not found`,
      });
    }

    const alreadyWatched =
      req.user.history &&
      req.user.history.watched &&
      req.user.history.watched.includes(course._id);

    if (alreadyWatched) {
      return res.status(400).json({
        success: false,
        error: `Course with ${req.params.id} already watched`,
      });
    }

    var user = new User(req.user);
    user.history.watched = [...user.history.watched, course._id];
    user
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: user._id,
          message: "User history updated.",
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          error,
          message: "Unable to update user-info!",
        });
      });
  });
};

const getUserRatingOnCourse = async (req, res) => {
  Rating.findOne({ courseId: req.params.id }, (err, rating) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!rating) {
      return res.status(404).json({
        success: false,
        error: `Course with ${req.params.id} has not been rated yet.`,
      });
    }

    var userRating = 0;

    if (rating.fiveStar.includes(req.user._id)) userRating = 5;
    if (rating.fourStar.includes(req.user._id)) userRating = 4;
    if (rating.threeStar.includes(req.user._id)) userRating = 3;
    if (rating.twoStar.includes(req.user._id)) userRating = 2;
    if (rating.oneStar.includes(req.user._id)) userRating = 1;

    return res.status(200).json({ success: true, data: userRating });
  });
};

module.exports = {
  getCategories,
  getUserRatingOnCourse,
  updateCourseRatings,
  setCourseWatched,
  courseTransaction,
};
