const config = require('./config');
const express = require('express');
const app = express();
const authMiddleware = require('./middlewares/auth');
const multer = require('multer');
const upload = multer().single('image');
const uploadController = require('./controllers/upload');

const PORT = config.port;
const PREFIX = config.prefix;

// SETUP
app.use(express.json());


// METHODS
app.post(`${PREFIX}/auth`, authMiddleware.login);
app.post(`${PREFIX}/upload`, authMiddleware.isAuth, upload, uploadController);


// ERROR HANDLING
app.use('*', (req, res) => res.status(404).json({error: true, message: 'Not Found!'}));
app.use((err, req, res, next) => res.status(500).json({error: true, message: err.message}));


// START
app.listen(PORT, () => console.log(`Server listening on ${PORT} port...`));