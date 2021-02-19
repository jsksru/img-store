const config = require('./config');
const express = require('express');
const multerUpload = require('multer')().single('image');
const { Worker } = require('worker_threads');

const { isAuth } = require('./middlewares/auth.middleware');
const uploadController = require('./controllers/upload.controller');
const authController = require('./controllers/auth.controller');

const app = express();
const PORT = config.port;
const PREFIX = config.prefix;

// SETUP
app.use(express.json());


// METHODS
app.post(`${PREFIX}/auth`, authController.login);
app.post(`${PREFIX}/upload`, isAuth, multerUpload, uploadController);


// ERROR HANDLING
app.use('*', (req, res) => res.status(404).json({error: true, message: 'Not Found!'}));
app.use((err, req, res, next) => res.status(500).json({error: true, message: err.message}));


// START
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT} port...`);
  const ThreadsWorker = new Worker('./workers/imageProcessor.worker.js');
  ThreadsWorker.on('message', (message) => console.log('[WORKER] message: ', message));
  ThreadsWorker.on('error', (err) => console.log('[WORKER] error: ', err.message));
  global.ThreadsWorker = ThreadsWorker; 
});