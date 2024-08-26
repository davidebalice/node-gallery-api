const app = require('express')();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http').Server(app);
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const cors = require('cors');

global.token = '';
/*
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Vary', 'Origin');
  //res.setHeader('Cache-Control', 'no-store');
  next();
});
*/

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL2,
  process.env.BACKEND_URL,
  process.env.LOCALHOST_URL,
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const regex = /^https:\/\/(.+\.)?davidebalice\.dev$/;
  if (regex.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || /(^|\.)davidebalice\.dev$/.test(origin) || /^http:\/\/localhost(:\d{1,5})?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
  })
);

app.use((req, res, next) => {
  res.setHeader('Vary', 'Origin');
  res.setHeader('Cache-Control', 'no-store');
  next();
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connections successfully');
  })
  .catch((err) => {
    console.error('Errore nella connessione a MongoDB:', err);
  });

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection!');
  process.exit(1);
});

process.on('unchaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unchaught Exception!');
  process.exit(1);
});

var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var i18n = require('i18n-express');

app.use(cookieParser());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(
  i18n({
    translationsPath: path.join(__dirname, 'i18n'),
    siteLangs: ['es', 'en', 'de', 'it', 'fr'],
    textsVarName: 'translation',
  })
);

app.use(express.static(path.join(__dirname, 'public')));

const authRouter = require('./routers/authRoutes');
const dashboardRouter = require('./routers/dashboardRoutes');
const userRouter = require('./routers/userRoutes');
const galleryRouter = require('./routers/galleryRoutes');
const categoryRouter = require('./routers/categoryRoutes');

app.use('/api/', authRouter);
app.use('/api/', dashboardRouter);
app.use('/api/', userRouter);
app.use('/api/', galleryRouter);
app.use('/api/', categoryRouter);

http.listen(8001, function () {
  console.log('listening on *:8001');
});
