const User = require("../models/user");
const url = require("url");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const randomstring = require("randomstring");
const mailer = require("../utils/Mailer");
const ExternalAuth = require("../utils/Authenticate");
const { AppDefaults } = require("../config");

const userRegistration = async (req, role, res) => {
  let body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide user details",
    });
  }

  let emailExists = await validateEmail(body.email);
  if (emailExists) {
    return res.status(400).json({
      success: false,
      error: "Email already exists",
    });
  }

  const user = new User(body);
  if (!user) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid user details!" });
  }

  user.role = role;
  user.passwordResetToken = randomstring.generate();

  user
    .save()
    .then(() => {
      const basePath = body.redirectUrl
        ? body.redirectUrl
        : "http://localhost:3100/api/verify-user";
      const passwordResetLink = `${basePath}?username=${user.email}&token=${user.passwordResetToken}`;
      const sub = "Email Confirmation - CourseApp";
      const html = `Hi there,
      <br/><br/>
      Thank you for registering to CourseApp! Please verify your email by clicking the below link,
      <br/>
      <a href=${passwordResetLink}>Click here to reset password!</a>
      <br/><br/>
      Thank you!
      <br/>`;

      mailer
        .sendEmail("admin@courseapp.com", user.email, sub, html)
        .then(() => {
          return res.status(201).json({
            success: true,
            id: user._id,
            message: "User created!",
          });
        })
        .catch((error) => {
          return res.status(200).json({
            success: false,
            id: user._id,
            message:
              "User created but faced some technical issues. Please get in touch with support team.",
          });
        });
    })
    .catch((error) => {
      return res.status(400).json({
        error: error,
        message: "User not created!",
      });
    });
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? true : false;
};

const forgotPassword = async (req, res) => {
  const { email, redirectUrl } = url.parse(req.url, true).query;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide email address!",
    });
  }

  await User.findOne({ email: email }, async (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: `Email doesn't exists.` });
    }

    user.passwordResetToken = randomstring.generate();

    user
      .save()
      .then(() => {
        const basePath = redirectUrl
          ? redirectUrl
          : "http://localhost:3100/api/verify-user";
        const passwordResetLink = `${basePath}?username=${user.email}&token=${user.passwordResetToken}`;
        const sub = "Password Reset - CourseApp";
        const html = `Hi there,
      <br/><br/>
      This is a system generated email. Please click on the link below to reset your password,
      <br/>
      <a href=${passwordResetLink}>Click here to reset your password!</a>
      <br/><br/>
      Thank you!
      <br/>`;

        mailer
          .sendEmail("admin@courseapp.com", user.email, sub, html)
          .then(() => {
            return res.status(201).json({
              success: true,
              message:
                "Password reset link successfully sent to the registered account.",
            });
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              message: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err,
        });
      });
  }).catch((err) => {
    return res.status(500).json({
      success: false,
      message: err,
    });
  });
};

const userLogin = async (req, role, res) => {
  let { email, password, authToken } = req.body;

  await User.findOne({ email: email }, async (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: `User credentials invalid` });
    }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        error: `Please make sure you are logging in from the right portal`,
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: `You have not verified your account! Please go to your registered email account to complete verification process.`,
      });
    }

    let isMatch = false;
    if (authToken) {
      isMatch = await ExternalAuth.verifyGoogleAuth(authToken);
    }
    if (password) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (isMatch) {
      let token = jwt.sign(
        {
          user_id: user._id,
          role: user.role,
          email: user.email,
        },
        AppDefaults.SECRET,
        { expiresIn: "7 days" }
      );

      let data = {
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
        token: `Bearer ${token}`,
        expiresIn: 168,
      };

      return res.status(200).json({ success: true, data: data });
    }

    return res
      .status(403)
      .json({ success: false, error: `User credentials invalid` });
  }).catch((err) => {
    return res.status(500).json({
      success: false,
      error: `Something went wrong. Please try again!`,
    });
  });
};

const userAuth = passport.authenticate("jwt", { session: false });

const checkRole = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) return next();
  return res.status(401).json({
    message: "Unauthorized",
    success: false,
  });
};

const verifyPasswordReset = async (req, res) => {
  const { token, username } = url.parse(req.url, true).query;
  const { password } = req.body;

  User.findOne({ email: username }, async (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user || user.passwordResetToken !== token) {
      return res
        .status(404)
        .json({ success: false, error: `Invalid attempt to reset password.` });
    }

    user.password = await bcrypt.hash(password, 12);
    user.isVerified = true;
    user.passwordResetToken = null;

    user
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: user._id,
          message: "User password successfully changed.",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Unable to reset password. Please try again.",
        });
      });
  });
};

const serializedUser = (user) => {
  return {
    email: user.email,
    name: user.name,
    profileImg: user.profileImage,
    role: user.role,
  };
};

const getUserByEmail = async (req, res) => {
  await User.findOne({ email: req.user.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found` });
    }

    return res.status(200).json({ success: true, data: serializedUser(user) });
  }).catch((err) => console.log(err));
};

const updateUser = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  User.findOne({ email: req.user.email }, (err, user) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "User not found!",
      });
    }

    user.name = body["name"];
    user.profileImage = body["profileImage"];
    //user.password = body["password"];
    user.role = body["role"];

    user
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: user._id,
          message: "User updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "User not updated!",
        });
      });
  });
};

module.exports = {
  userAuth,
  userRegistration,
  userLogin,
  checkRole,
  getUserByEmail,
  updateUser,
  verifyPasswordReset,
  forgotPassword,
};

// deleteUser = async (req, res) => {
//   await User.findOneAndDelete({ email: req.params.email }, (err, user) => {
//     if (err) {
//       return res.status(400).json({ success: false, error: err });
//     }

//     if (!user) {
//       return res.status(404).json({ success: false, error: `User not found` });
//     }

//     return res.status(200).json({ success: true, data: user });
//   }).catch((err) => console.log(err));
// };
