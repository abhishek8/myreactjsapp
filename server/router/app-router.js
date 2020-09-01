const express = require("express");

const UserCtrl = require("../controller/UserController");
const CourseCtrl = require("../controller/CourseController");
const MiscCtrl = require("../controller/MiscController");
const ResourceCtrl = require("../controller/ResourceController");

const router = express.Router();

// User Registration Routes
router.post("/register-user", async (req, res) => {
  await UserCtrl.userRegistration(req, "user", res);
});

// Trainer Registration Routes
router.post("/register-trainer", async (req, res) => {
  await UserCtrl.userRegistration(req, "trainer", res);
});

// Reviewer Registration Routes
router.post("/register-reviewer", async (req, res) => {
  await UserCtrl.userRegistration(req, "reviewer", res);
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// User Login Routes
router.post("/login-user", async (req, res) => {
  await sleep(5000);
  await UserCtrl.userLogin(req, "user", res);
});

// Trainer Login Routes
router.post("/login-trainer", async (req, res) => {
  await UserCtrl.userLogin(req, "trainer", res);
});

// Reviewer Login Routes
router.post("/login-reviewer", async (req, res) => {
  await UserCtrl.userLogin(req, "reviewer", res);
});

// Admin Login Routes
router.post("/login-admin", async (req, res) => {
  await UserCtrl.userRegistration(req, "admin", res);
});

// User operations
router.get("/user", UserCtrl.userAuth, UserCtrl.getUserByEmail);
router.put("/user", UserCtrl.userAuth, UserCtrl.updateUser);
router.post("/verify-user", UserCtrl.verifyPasswordReset);
router.get("/forgot-password", UserCtrl.forgotPassword);

// Course CRUD Routes
router.get("/courses", CourseCtrl.getCourses);

router.get(
  "/course/my-courses/",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["trainer"]),
  CourseCtrl.getCoursesByAuthor
);

router.get(
  "/course/subscription/",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["user"]),
  CourseCtrl.getUserPurchasedCourses
);

router.get(
  "/course/unverified/",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["reviewer"]),
  CourseCtrl.getUnverifiedCourses
);

router.get(
  "/course/verified/",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["reviewer"]),
  CourseCtrl.getReviewedCourses
);

router.get(
  "/course/:id",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["user", "trainer", "reviewer"]),
  CourseCtrl.getCourseDetails
);

router.post(
  "/course",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["trainer"]),
  CourseCtrl.createCourse
);

router.put(
  "/course/submit/:id",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["trainer"]),
  CourseCtrl.submitCourseForReview
);

router.post(
  "/course/verify",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["reviewer"]),
  CourseCtrl.verifyCourse
);

router.put(
  "/course/:id",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["trainer"]),
  CourseCtrl.updateCourseDetails
);

router.put(
  "/course-ratings/",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["user", "trainer"]),
  MiscCtrl.updateCourseRatings
);

router.delete(
  "/course/:id",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["trainer"]),
  CourseCtrl.deleteCourse
);

router.post(
  "/course/deactivate/:id",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["trainer"]),
  CourseCtrl.deactivateCourse
);

// Purchase Course
router.post(
  "/course/transact/",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["user"]),
  MiscCtrl.courseTransaction
);

router.post(
  "/course/watched/:id",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["user"]),
  MiscCtrl.setCourseWatched
);

// Get User Rating on Course
router.get(
  "/course/my-rating/:id",
  UserCtrl.userAuth,
  UserCtrl.checkRole(["user"]),
  MiscCtrl.getUserRatingOnCourse
);

// Get All Category Names
router.get("/categories", MiscCtrl.getCategories);

// Upload Images
router.post("/upload/image", ResourceCtrl.uploadCourseImage);

// Upload Documents
router.post("/upload/docs", ResourceCtrl.uploadHTMLContent);

module.exports = router;
