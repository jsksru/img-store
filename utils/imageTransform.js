const Jimp = require('jimp');
const { v4: uuid } = require('uuid');
const fs = require('fs').promises;
const sizeOf = require('image-size');

const imageResize = async (imageDir, extension, maxWidth, maxHeight, newName) => {
  try {
    const file = await Jimp.read(`./${imageDir}/original.${extension}`);
    file.scaleToFit(maxWidth, maxHeight);
    await file.writeAsync(`./${imageDir}/${newName}.${extension}`);
    const dimensions = await sizeOf(`./${imageDir}/${newName}.${extension}`);
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
    const oldPath = `./${imageDir}/original.${extension}`;
    const newPath = `${imageDir}/${uuid()}.${extension}`;
    await fs.rename(oldPath, `./${newPath}`);
    return newPath;
  } catch (err) {
    throw new Error(err.message);
  }

};

module.exports.imageResize = imageResize;
module.exports.renameOriginal = renameOriginal;