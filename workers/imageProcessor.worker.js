const config = require('../config');
const db = require('../db');
const {isMainThread, parentPort} = require('worker_threads');
const imageTransform = require('../utils/imageTransform');

if (!isMainThread) {
  parentPort.on('message', ({imageDir, extension, imageId}) => {
    try {
      setTimeout(async () => {
        const sizesCollector = [];

        for (size of config.dimensions) {
          const result = await imageTransform.imageResize(imageDir, extension, size.maxWidth, size.maxHeight, size.fileName);
          sizesCollector.push(result);
        }
  
        const newOriginalPath = await imageTransform.renameOriginal(imageDir, extension);
        await db.editById(imageId, { original: newOriginalPath, complete: true, images: sizesCollector });
  
        parentPort.postMessage(`Processing image with id=${imageId} complete!`);
      }, 0);
    } catch(err) {
      throw new Error(err.message);
    }
  });
}