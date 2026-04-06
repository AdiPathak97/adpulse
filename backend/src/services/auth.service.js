const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,       // JS cannot access this cookie
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
    sameSite: 'strict',  // no cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in ms
  });
};

module.exports = { generateToken, setTokenCookie };