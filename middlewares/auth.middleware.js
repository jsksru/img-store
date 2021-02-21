const config = require('../config');
const jwt = require('jsonwebtoken');

const SECRET = config.secret;

module.exports.isAuth = (req, res, next) => {
  try {
    const requestToken = (req.get('Authorization') || '').replace('Bearer ', '');
    if (!requestToken) throw new Error('Token not found');
    const verify = jwt.verify(requestToken, SECRET);
    if (verify) next();
  } catch(err) {
    next(new Error(err.message));
  }
};

module.exports.checkAuth = (req, res, next) => {
  req.isAuth = false;
  try {
    const requestToken = (req.get('Authorization') || '').replace('Bearer ', '');
    const verify = jwt.verify(requestToken, SECRET);
    if (verify) req.isAuth = true;
  } catch {}
  next();
};