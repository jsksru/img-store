const config = require('../config');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const SECRET = config.secret;

const USERS = [
  {
    id: 1,
    login: 'user',
    password: '$argon2i$v=19$m=4096,t=3,p=1$s80r6wkwMDlTBl7+OMWC3w$c/R3WI6sAxX0ER5YkNcrfrkl2N8LtwKeddKB9DJxyEo', //password 12345
  }
];

const login = async (req, res) => {
  try {
    const {login, password} = req.body;
    if (!login || !password) throw new Error('Empty login or password!');

    const user = USERS.find(u => u.login === login);
    if (!user) throw new Error('User Not Found!');

    const decodePassword = await argon2.verify(user.password, password);
    if (!decodePassword) throw new Error('Wrong password!');

    const token = jwt.sign({userId: user.id}, SECRET);

    return res.status(200).json({ status: 'success', token });
  } catch(err) {
    return res.status(401).json({error: true, message: err.message});
  }
};

module.exports.login = login;