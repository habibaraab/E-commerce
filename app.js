const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const xssClean = require('xss-clean');

const authRoutes = require('./routes/auth.route');
const adminRoutes = require('./routes/admin.route');
const userRoutes = require('./routes/user.route');
const isAuthenticated = require('./middlewares/auth/isAuthenticated');

dotenv.config();

const app = express();

const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: false,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// security middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(xssClean());

// sesion settings
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
  }
}));




// static files
app.use(express.static(path.join(__dirname, 'public')));

// general routes
app.use('/auth', authRoutes);
const testSanitizeRoute = require('./routes/testSanitize.route');
const testXSSRoute = require('./routes/testXSS.route');
app.use('/test-sanitize', testSanitizeRoute); 
app.use('/test-xss', testXSSRoute);

// authentication on
app.use(isAuthenticated);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// main route
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

module.exports = app;