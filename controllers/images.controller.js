const db = require('../db');

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error('Incorrect or empty ID');
    const image = await db.getById(id);
    if (!image) return res.status(404).json({ error: true, message: 'Image Not Found!' });
    if (image.complete && !req.isAuth) image.original = null;
    return res.status(200).json(image);
  } catch (err) {
    return next(new Error(err.message));
  }
};

module.exports.getById = getById;