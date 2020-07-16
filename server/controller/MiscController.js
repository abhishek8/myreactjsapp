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
  courseTransaction,
};
