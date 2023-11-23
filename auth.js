const jwtSecret = require("./config").jwtSecret;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");
const Users = require("./models").User;

let generateJWTToken = (user) => {
	return jwt.sign(user, jwtSecret, {
		subject: user.Username,
		expiresIn: "7d",
		algorithm: "HS256",
	});
};

const auth = (router) => {
	router.post("/login", (req, res) => {
		passport.authenticate("local", { session: false }, (error, user, info) => {
			if (error || !user) {
				return res.status(400).json({
					message: "Incorrect username or password.",
					user: user,
				});
			}
			req.login(user, { session: false }, async (error) => {
				if (error) {
					res.send(error);
				}
				const token = generateJWTToken(user.toJSON());
				return res.json({ user, token });
			});
		})(req, res);
	});
};

module.exports = auth;
