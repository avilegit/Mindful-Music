var createError = require('http-errors');
var express = require('express');
var request = require('request'); // "Request" library
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var querystring = require('querystring');
                  require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var spawn = require("child_process").spawn; 
var util = require("util");

var app = express();


const env = require('dotenv').config();
var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

app.post('/pythonFormat', function(req,res){
  var returned_json = "";

  console.log('req',req.body.songs);

  var pythonPayload = {
    songs : req.body.songs.items,
  }

  const py = spawn('python',["data/data_collection.py", req.body.items]);
  py.stdin.write(JSON.stringify(pythonPayload));
  py.stdin.end();

  py.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
  });
  py.stdout.on('data', function(data){
    returned_json += data.toString();// buffer to string
  });

  py.stdout.on('end', function(){
    res.send(JSON.stringify(returned_json)); 
  });
});

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-read-recently-played';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
  res.status(200);
});

app.get('/callback', function(req, res) {

// your application requests refresh and access tokens
// after checking the state parameter

var code = req.query.code || null;
var state = req.query.state || null;
var storedState = req.cookies ? req.cookies[stateKey] : null;

if (state === null || state !== storedState) {
  res.redirect('/#' +
    querystring.stringify({
      error: 'state_mismatch'
    }));
} else {
  res.clearCookie(stateKey);
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var access_token = body.access_token,
          refresh_token = body.refresh_token;

      res.redirect('/#' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        }));
    } else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  });
}

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
