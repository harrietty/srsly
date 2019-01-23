require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);
const app = express();
const passport = require('./lib/passport');
const {requireSignin, requireAuth} = require('./lib/middlewares/requireAuth');
const apiRouter = require('./lib/routers/api.router');
const {getDecks} = require('./lib/db/decks');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(expressSession({
  store: new FileStore(),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', requireAuth, apiRouter);

app.get('/', (req, res) => {
  res.render('welcome');
});

app.get('/home', requireSignin, (req, res) => {
  const {user} = req;
  const decks = getDecks(user.email);
  return res.render('home', {user, decks});
});

app.get('/signin', (req, res) => {
  res.render('signin');
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  // If this function gets called, authentication was successful.
  res.redirect('/home');
});

app.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

module.exports = app;
