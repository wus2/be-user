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
    async (accessToken, refreshToken, profile, callback) => {
      // Check whether the User exists or not using profile.id
      if (!profile) {
        userModel
          .getByFBID(profile.id)
          .then(data => {
            console.log("There is no such user, adding now");
            var entity = {
              fb_id: profile.id,
              username: profile.username ? profile.username : profile.id,
              password: req.body.password,
              email: req.body.email,
              address: req.body.address,
              name: profile.displayName,
              phone: req.body.phone,
              dob: req.body.dob,
              card_id: req.body.cardID,
              gender: req.body.gender
            };
            userModel.add(entity).then();
          })
          .catch(err => {
            console.log(err);
          });
        pool.query(
          "SELECT * from user_info where user_id=" + profile.id,
          (err, rows) => {
            if (err) throw err;
            if (rows && rows.length === 0) {
              console.log("There is no such user, adding now");
              pool.query(
                "INSERT into user_info(user_id,user_name) VALUES('" +
                  profile.id +
                  "','" +
                  profile.username +
                  "')"
              );
            } else {
              console.log("User already exists in database");
            }
          }
        );
        return callback(null, {
          token: accessToken,
          profile
        });
      }
      return callback(null, {
        token: accessToken,
        profile
      });
    }
  )
);
