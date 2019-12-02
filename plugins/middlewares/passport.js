const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const FacebookStrategy = require("passport-facebook").Strategy;
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

const fb = config.get("facebook");

passport.use(
  new FacebookStrategy(
    {
      clientID: fb.client_id,
      clientSecret: fb.client_secret,
      callbackURL: fb.callback_url,
      profileFields: ["email", "name"]
    },
    (accessToken, refreshToken, profile, callback) => {
      console.log("SOMETHING HERE")
      const { email, first_name, last_name } = profile._json;
      const entity = {
        email,
        name: first_name + " " + last_name
      };

      console.log(entity)
      // userModel.add(entity);
      callback(null, profile);
    }
  )
);
