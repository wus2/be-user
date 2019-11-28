const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const userModel = require('../database/users');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false
    },
    async (username, password, callback) => {
      return userModel
        .get(username, password)
        .then(user => {
          if (!user) {
            return callback(null, false, { message: 'Incorrect fields' });
          }
          return callback(null, user, { message: 'Logged' });
        })
        .catch(err => {
          callback(err);
        });
    }
  )
);