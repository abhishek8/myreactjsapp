const nodemailer = require("nodemailer");
const { Mailer } = require("../config");

const transport = nodemailer.createTransport({
  service: "Mailgun",
  auth: {
    user: Mailer.MAILGUN_USER,
    pass: Mailer.MAILGUN_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (from, to, subject, html) => {
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};

module.exports = {
  sendEmail,
};
