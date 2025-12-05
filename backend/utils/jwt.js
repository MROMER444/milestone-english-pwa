const jwt = require('jsonwebtoken');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

module.exports = { generateTokens, verifyToken };
