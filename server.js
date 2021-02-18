const config = require('./config');
const fs = require('fs').promises;
const express = require('express');
const app = express();
const authMiddleware = require('./middlewares/auth');
const uuid = require('uuid').v4;
const multer = require('multer');
const upload = multer().single('image');
const sizeOf = require('image-size');
const Jimp = require('jimp');
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
    const origName = req.file.originalname;
    const extension = req.file.originalname.slice(origName.lastIndexOf('.') + 1, req.file.originalname.length);
    const fileBuffer = req.file.buffer;
    const imageSize = sizeOf(fileBuffer);

    const imageDir = `${config.uploadDir}/${imageId.slice(0,2)}/${imageId}`;
    await fs.mkdir(imageDir, {recursive: true});

    const pathToFile = `${imageDir}/original.${extension}`;
    await fs.writeFile(pathToFile, fileBuffer);

    (await Jimp.read(pathToFile))
      .scaleToFit(config.dimensions.small.maxWidth, config.dimensions.small.maxHeight)
      .write(`${imageDir}/${config.dimensions.small.fileName}.${extension}`);

    (await Jimp.read(pathToFile))
      .scaleToFit(config.dimensions.medium.maxWidth, config.dimensions.medium.maxHeight)
      .write(`${imageDir}/${config.dimensions.medium.fileName}.${extension}`);

    (await Jimp.read(pathToFile))
      .scaleToFit(config.dimensions.thumb.maxWidth, config.dimensions.thumb.maxHeight)
      .write(`${imageDir}/${config.dimensions.thumb.fileName}.${extension}`);

    db.addNew({
      id: imageId,
      url: `${imageDir}/original.${extension}`
    });

    res.status(200).json({status: 'uploaded', imageId, size: {width: imageSize.width, height: imageSize.height} });
  } catch(err) {
    next(new Error(err.message));
  }
});



/// Errors handling
app.use('*', (req, res) => {
  res.status(404).json({error: true, message: 'Not Found!'});
});

app.use((err, req, res, next) => {
  res.status(500).json({error: true, message: err.message});
});

app.listen(PORT, () => console.log(`Server listening on ${PORT} port...`));