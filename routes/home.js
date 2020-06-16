const express = require('express');
const router = express.Router();

// const HomeController = require('../controllers/home');

// router.get('/', HomeController.Index);
router.get('/', function (req, res, next) {
  res.render('home/index', { title: 'Auth0 Webapp sample Nodejs' });
});

module.exports = router;
