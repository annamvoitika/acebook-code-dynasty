const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// photo
const multer = require('multer');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const homeRouter = require('./routes/home');
const postsRouter = require('./routes/posts');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// photo
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'hbs');

const mongoURI = 'mongodb+srv://acebook-code-dynasty:code-dynasty@acebook-code-dynasty-wqegs.mongodb.net/acebook-code-dynasty?retryWrites=true&w=majority';

const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
     return new Promise((resolve, reject) => {
       crypto.randomBytes(16, (err, buf) => {
         if (err) {
           return reject(err);
         }
         const filename = buf.toString('hex') + path.extname(file.originalname);
         const fileInfo = {
           filename: filename,
           bucketName: 'uploads'
         };
         resolve(fileInfo);
       });
     });
   }
 });
 const upload = multer({ storage });

app.get('/posts/photo', (req, res) => {
  res.render('posts/photo');
});

app.post('/upload', upload.single('file'),(req, res) => {
  res.json({file: req.file});
});

// route setup
app.use('/', homeRouter);
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
