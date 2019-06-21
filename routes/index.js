var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200);
  res.render('launch', {title: 'Mindful Music'});
});

router.get('/launch', function(req, res, next) {
  res.status(200);
  res.render('launch', {title: 'Mindful Music'});
});

module.exports = router;
