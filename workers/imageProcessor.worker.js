const config = require('../config');
const db = require('../db');
const {isMainThread, parentPort} = require('worker_threads');
const imageTransform = require('../utils/imageTransform');

const mongoose = require('mongoose');
mongoose.connect(config.dbString, {useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000});

if (!isMainThread) {
  try {
    parentPort.on('message', async ({imageDir, extension, imageId}) => {
      setTimeout(async() => {
        try {
          const sizesCollector = [];
    
          for (size of config.dimensions) {
            sizesCollector.push(await imageTransform.imageResize(imageDir, extension, size.maxWidth, size.maxHeight, size.fileName));
          }
    
          const newOriginalPath = await imageTransform.renameOriginal(imageDir, extension);
          await db.editById(imageId, { original: newOriginalPath, complete: true, images: sizesCollector });
    
          parentPort.postMessage(`Processing image with id=${imageId} complete!`);
        } catch(err) {
          throw new Error(err);
        }
      }, 0);
    });
  } catch(err) {
    throw new Error(err);
  }
}


