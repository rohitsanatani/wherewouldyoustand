const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Response = require('./models/response');
const bp = require('body-parser');
require('dotenv').config();

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = process.env.ATLAS_SRV;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(process.env.PORT||3000))
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
  res.render('play', {title: 'Play' });
});

/*
app.get('/results', (req, res) => {
  res.render('results', {gameId: req.query.gameId, title: 'Results' });
  console.log('logging request')
  console.log(req.query.gameId);
});
*/

app.get('/results', (req, res) => {
      res.render('results', {thisGameId: req.query.gameId, title: 'Results' });
    });


app.get('/getgamedata', (req, res) => {
  Response.find({gameId: req.query.gameId}).sort({sceneId: 1}).then(result => {
      return res.send({gameUserData:result})
    })
    .catch(err => {
      console.log(err);
    });
});


app.get('/testpost', (req, res) => {
  const response = new Response(
    {
      sceneId:0,
      sceneCount:0,
      dataset:'test',
      userName: 'test_post',
      gameId: 'test_game',
      userX: 0,
      userY: 0,
      responseTime:0,
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
/*
app.post('/play', (req, res) => {
  console.log(req.body);
  //const response = new Response(req.body);
  //response.save();
  console.log('Post Success!')
});
*/

app.post('/play', (req, res) => {
  console.log(req.body);
  for (i = 0;i<req.body.userName.length;i++){
    const response = new Response(
      {
        sceneId : req.body.sceneId[i],
        sceneCount : req.body.sceneCount[i],
        dataset : req.body.dataset[i],
        userName: req.body.userName[i],
        gameId: req.body.gameId[i],
        userX: req.body.userX[i],
        userY: req.body.userY[i],
        responseTime : req.body.responseTime[i],
      }
    );
    response.save();
    console.log('Post '+i.toString()+'Success!');
  }
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});