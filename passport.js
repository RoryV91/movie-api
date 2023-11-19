const config = require('./config');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'Username',
        passwordField: 'Password',
      },
      async (username, password, callback) => {
        console.log(`${username} ${password}`);
        try {
          const user = await Users.findOne({ Username: username });
          if (!user) {
            console.log('incorrect username');
            return callback(null, false, {
              message: 'Incorrect username or password.',
            });
          }
          console.log('finished');
          return callback(null, user);
        } catch (error) {
          console.error(error);
          return callback(error);
        }
      }
    )
  );
  

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
  }, async (jwtPayload, callback) => {
  return await Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));