const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const {User} = require('../models');

module.exports = () => {
	passport.use(
		new LocalStrategy(
			{
        // req.body 객체인자 하고 키값이 일치해야 함
				usernameField: 'email', // req.body.email
				passwordField: 'password', // req.body.password
			},
			async (email, password, done) => {
				try {
					const exUser = await User.findOne({where: {email}});
					if (exUser) {
						const result = await bcrypt.compare(password, exUser.password);
						if (result) {
							done(null, exUser);
						} else {
							done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
						}
					} else {
						done(null, false, {message: '가입되지 않은 회원입니다.'});
					}
				} catch (error) {
					console.error(error);
					done(error);
				}
			}));
};
