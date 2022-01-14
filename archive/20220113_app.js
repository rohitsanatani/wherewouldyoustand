const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Response = require('./models/response');
const bp = require('body-parser');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://rohitsanatani:rohit1992@cluster0.otwws.mongodb.net/subwaydata?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
//app.use(express.urlencoded({ extended: true }));
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/play');
});

app.get('/play', (req, res) => {
  res.render('play', { title: 'Play' });
});

app.get('/testpost', (req, res) => {
  const response = new Response(
    {
      sceneId:0,
      sceneCount:0,
      dataset:'test',
      user: 'test_post',
      gameId: 'test_game',
      userX: 0,
      userY: 0,
      responseTime:0,
      nComp:0,
      compX:'test',
      compY:'test',
      nSeats:0,
      seatX:'test',
      seatY:'test',
      nDoors:0,
      doorX:'test',
      doorY:'test',
      planWidth:0,
      planHeight:0,
    }
  );
  response.save()
  .then(result => {
    console.log('Test Post Success!')
    res.redirect('/play');
  })
  .catch(err => {
    console.log(err);
  });
});

app.post('/play', (req, res) => {
  console.log(req.body);
  const response = new Response(req.body);
  response.save();
  console.log('Post Success!')
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});