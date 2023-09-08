const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user');
const dotenv = require("dotenv");

dotenv.config();

// 회원가입
exports.join = async (req, res, next) => {
	const { email, nick, password } = req.body;
	try {
		const exUser = await User.findOne({ where: { email } });
		if (exUser) {
			return res.status(400).json({error: '이미 존재하는 유저'});
		}
		const hash = await bcrypt.hash(password, 12);
		await User.create({
			email,
			nick,
			password: hash,
			role: "user",
		});
		return res.status(200).json('회원가입 완료');
	} catch (error) {
		console.error(error);
		return next(error);
	}
}

// 로그인
exports.login = (req, res, next) => {
	passport.authenticate('local', (authError, user, info) => {
		if (authError) {
			console.error(authError);
			return next(authError);
		}
		if (!user) {
			return res.status(400).json({ message: info.message });
		}
		return req.login(user, (loginError) => {
			if (loginError) {
				console.error(loginError);
				return res.status(400).json({message: loginError});
			}
			return res.status(200).json(user);
		});

	})(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

// 로그아웃
exports.logout = (req, res, next) => {
	req.logout(err => {
		if (err) {
			return next(err);
		} else {
			req.session.destroy();
			res.status(200).redirect('/');

		}
	});
};