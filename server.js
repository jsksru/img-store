const config = require('./config');
const fs = require('fs').promises;
const express = require('express');
const app = express();
const authMiddleware = require('./middlewares/auth');
const uuid = require('uuid').v4;
const multer = require('multer');
const upload = multer().single('image');
const db = require('./db');

const PORT = config.port;
const PREFIX = config.prefix;

app.use(express.json());



app.get(`${PREFIX}/`, (req, res) => {
  res.json({status: 'success'});
});

app.post(`${PREFIX}/auth`, authMiddleware.login);

app.post(`${PREFIX}/upload`, upload, authMiddleware.isAuth, async (req, res, next) => {
  try {
    if (!req.file) throw new Error('No file');
    if (req.file.size > config.maxSize) throw new Error('File too large!');
    if (!config.allowTypes.includes(req.file.mimetype)) throw new Error('Wrong file type!');

    const imageId = uuid();
    const extension = req.file.originalname.slice(req.file.originalname.lastIndexOf('.') + 1, req.file.originalname.length);

    const imageDir = `${config.uploadDir}/${imageId.slice(0,2)}/${imageId}`;
    await fs.mkdir(imageDir, {recursive: true});

    const pathToFile = `${imageDir}/original.${extension}`;
    await fs.writeFile(pathToFile, req.file.buffer);

    const imageInfo = {
      imageId,
      original: pathToFile,
      uploaded: Date.now(),
      complete: false,
      images: null,
    };

    await db.addNew(imageInfo);

    return res.status(200).json({status: 'uploaded', imageId });
  } catch(err) {
    next(new Error(err.message));
  }
});



/// Errors handling
app.use('*', (req, res) => {
  return res.status(404).json({error: true, message: 'Not Found!'});
});

app.use((err, req, res, next) => {
  return res.status(500).json({error: true, message: err.message});
});

app.listen(PORT, () => console.log(`Server listening on ${PORT} port...`));