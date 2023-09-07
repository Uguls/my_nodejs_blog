const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.status(401).redirect('/')

});

// GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // 프로파일과 이메일 정보를 받는다.

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), //? 그리고 passport 로그인 전략에 의해 googleStrategy로 가서 구글계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  (req, res) => {
    res.status(200).redirect('/');

  },
);

module.exports = router;