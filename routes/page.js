const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});



router.get('/', (req, res) => {
  res.render('main');
});




module.exports = router;
