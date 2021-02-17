const config = require('../config');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const SECRET = config.secret;
const USERS = [
  {
    id: 1,
    login: 'user',
    password: '$argon2i$v=19$m=4096,t=3,p=1$s80r6wkwMDlTBl7+OMWC3w$c/R3WI6sAxX0ER5YkNcrfrkl2N8LtwKeddKB9DJxyEo', //password 12345
  }
];

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

module.exports.login = async (req, res) => {
  try {
    const {login, password} = req.body;
    if (!login || !password) throw new Error('Empty login or password!');

    const user = USERS.find(u => u.login === login);
    if (!user) throw new Error('User Not Found!');

    const decodePassword = await argon2.verify(user.password, password);
    if (!decodePassword) throw new Error('Wrong password!');

    const token = jwt.sign({userId: user.id}, SECRET);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch(err) {
    res.status(401).json({error: true, message: err.message});
  }
};