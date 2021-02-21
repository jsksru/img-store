const fs = require('fs').promises;
const uuid = require('uuid').v4;

const config = require('../config');
const db = require('../db');

module.exports = async (req, res, next) => {
  try {
    if (!req.file) throw new Error('No file');
    if (req.file.size > config.maxSize) throw new Error('File too large!');
    if (!config.allowTypes.includes(req.file.mimetype)) throw new Error('Wrong file type!');

    const imageId = uuid();
    const extension = req.file.originalname.slice(req.file.originalname.lastIndexOf('.') + 1, req.file.originalname.length);
    const imageDir = `${uuid().slice(0,2)}/${imageId}`;

    await fs.mkdir(`${config.uploadDir}/${imageDir}`, {recursive: true});
    await fs.writeFile(`${config.uploadDir}/${imageDir}/original.${extension}`, req.file.buffer);

    await db.addNew({
      imageId,
      original: `${imageDir}/original.${extension}`,
      uploaded: Date.now(),
      complete: false,
      images: null,
    });
    
    global.Worker.postMessage({ imageDir, extension, imageId });

    return res.status(200).json({status: 'uploaded', imageId });
  } catch(err) {
    next(new Error(err.message));
  }
};