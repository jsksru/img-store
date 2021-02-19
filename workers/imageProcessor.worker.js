const config = require('../config');
const db = require('../db');
const sizeOf = require('image-size');
const {isMainThread, parentPort} = require('worker_threads');
const Jimp = require('jimp');

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

if (!isMainThread) {
  parentPort.on('message', async ({imageDir, extension, imageId}) => {
    try {
      const sizesCollector = [];

      for (size of config.dimensions) {
        const result = await imageResize(imageDir, extension, size.maxWidth, size.maxHeight, size.fileName);
        sizesCollector.push(result);
      }

      await db.editById(imageId, { complete: true, images: sizesCollector });

      parentPort.postMessage(`Processing image with id=${imageId} complete!`);
    } catch(err) {
      throw new Error(err.message);
    }
  });
}