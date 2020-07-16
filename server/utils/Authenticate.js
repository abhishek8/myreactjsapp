const { Google } = require("../config");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");

const verifyGoogleAuth = async (token) => {
  try {
    const client = new OAuth2Client(Google.CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: Google.CLIENT_ID,
    });

    if (!ticket) return false;

    const payload = ticket.getPayload();

    return payload && payload.email_verified;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  verifyGoogleAuth,
};
