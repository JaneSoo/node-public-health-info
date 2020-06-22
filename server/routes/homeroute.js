const express = require('express');
// const axios = require('axios');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('../server/views/home.ejs');
});


router.post('/getCurrentLocation', function(req, res, next) {
  const longitude = req.body;
  console.log(longitude);
});


module.exports = router;
