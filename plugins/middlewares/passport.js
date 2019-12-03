const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const passwordFB = require("passport-facebook");
const FacebookStrategy = passwordFB.Strategy;
const config = require("config");

const userModel = require("../database/users");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false
    },
    async (username, password, callback) => {
      return userModel
        .get(username, password)
        .then(user => {
          if (!user) {
            return callback(null, false, { message: "Incorrect fields" });
          }
          return callback(null, user, { message: "Logged" });
        })
        .catch(err => {
          callback(err);
        });
    }
  )
);

passport.use(
  new JWTStategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("key_jwt")
    },
    async (jwtPayload, callback) => {
      callback(jwtPayload);
    }
  )
);

const fb = config.get("fb");
passport.use(
  new FacebookStrategy(
    {
      clientID: fb.client_id,
      clientSecret: fb.client_secret,
      callbackURL: fb.callback_url
    },
    async (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        if (!accessToken && !profile) {
          return done(
            new Error("Authenticate via facebook failed! Empty access token!")
          );
        }
        return done(null, profile);
      });
    }
  )
);
