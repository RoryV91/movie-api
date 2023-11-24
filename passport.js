const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const bcrypt = require("bcrypt");
const Users = require("./models").User;
const config = require("./config");

passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
            console.log("LocalStrategy called");
          const user = await Users.findOne({ username: username });
          if (!user) {
            console.log('User not found');
            return done(null, false, { message: 'Incorrect username.' });
          }
  
          const isValidPassword = await bcrypt.compare(password, user.password);
  
          if (!isValidPassword) {
            console.log('Incorrect password');
            return done(null, false, { message: 'Incorrect password.' });
          }
  
          console.log('Correct credentials');
          return done(null, user);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.jwtSecret,
		},
		async (jwtPayload, callback) => {
			try {
				const user = await Users.findById( jwtPayload._id );
				return callback(null, user);
			} catch (error) {
				return callback(error);
			}
		}
	)
);
