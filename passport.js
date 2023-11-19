const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const bcrypt = require('bcrypt');
const Users = require('./models').User;
const config = require('./config');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      try {
        const user = await Users.findOne({ Username: username });
        if (!user) {
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }

        const isValidPassword = await bcrypt.compare(password, user.Password);
        if (!isValidPassword) {
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }

        return callback(null, user);
      } catch (error) {
        console.error(error);
        return callback(error);
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
        const user = await Users.findById(jwtPayload.id);
        return callback(null, user);
      } catch (error) {
        return callback(error);
      }
    }
  )
);

