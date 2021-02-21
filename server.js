const config = require('./config');
const express = require('express');
const multerUpload = require('multer')().single('image');
const mongoose = require('mongoose');
const { Worker } = require('worker_threads');

const { isAuth } = require('./middlewares/auth.middleware');
const uploadController = require('./controllers/upload.controller');
const authController = require('./controllers/auth.controller');
const imagesController = require('./controllers/images.controller');

const app = express();
const PORT = config.port;
const PREFIX = config.prefix;
mongoose.connect('mongodb://root:example@localhost/images?authSource=admin', {useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000});

// SETUP
app.use(express.json());
app.use(express.static('./uploads'));


// METHODS
app.post(`${PREFIX}/auth`, authController.login);
app.post(`${PREFIX}/upload`, isAuth, multerUpload, uploadController);
app.get(`${PREFIX}/image/:id`, imagesController.getById);


// ERROR HANDLING
app.use('*', (req, res) => res.status(404).json({error: true, message: 'Not Found!'}));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({error: true, message: err.message});
});


// START
mongoose.connection.on('error', (err) => console.error('DB connection error : ', err.message));
mongoose.connection.once('open', function() {
  console.log('DB Connected !')
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT} port...`);
    const ThreadsWorker = new Worker('./workers/imageProcessor.worker.js');
    ThreadsWorker.on('message', (message) => console.log('[WORKER] message: ', message));
    ThreadsWorker.on('error', (err) => console.log('[WORKER] error: ', err.message));
    global.Worker = ThreadsWorker;
  });
});
