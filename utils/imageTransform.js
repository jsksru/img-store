const Jimp = require('jimp');
const config = require('../config');
const { v4: uuid } = require('uuid');
const fs = require('fs').promises;
const sizeOf = require('image-size');

const imageResize = async (imageDir, extension, maxWidth, maxHeight, newName) => {
  try {
    const file = await Jimp.read(`${config.uploadDir}/${imageDir}/original.${extension}`);
    file.scaleToFit(maxWidth, maxHeight);
    await file.writeAsync(`${config.uploadDir}/${imageDir}/${newName}.${extension}`);
    const dimensions = await sizeOf(`${config.uploadDir}/${imageDir}/${newName}.${extension}`);
    return {
      size: newName,
      src: `${imageDir}/${newName}.${extension}`,
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch(err) {
    throw new Error(err.message);
  }
};

const renameOriginal = async (imageDir, extension) => {
  try {
    const oldPath = `${config.uploadDir}/${imageDir}/original.${extension}`;
    const newPath = `${imageDir}/${uuid()}.${extension}`;
    await fs.rename(oldPath, `${config.uploadDir}/${newPath}`);
    return newPath;
  } catch (err) {
    throw new Error(err.message);
  }

};

module.exports.imageResize = imageResize;
module.exports.renameOriginal = renameOriginal;