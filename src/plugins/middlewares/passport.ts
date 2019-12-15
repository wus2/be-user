import passport from "passport";
import * as passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import * as passportJWT from "passport-jwt";
const JWTStategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import * as passportFB from "passport-facebook";
const FacebookStrategy = passportFB.Strategy;
import * as passportGG from "passport-google-oauth20";
const GoogleStrategy = passportGG.Strategy;
import config from "config";

import UserDB from "../database/user/user";

const userModel = new UserDB();

interface SocialApp {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false
    },
    async (username: string, password: string, callback: Function) => {
      return userModel.getValidUser(
        username,
        password,
        (err: Error, data: any) => {
          if (err) {
            return callback(err, null, { message: "Incorrect fields" });
          }
          return callback(null, data, { message: "Logged" });
        }
      );
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
      return callback(jwtPayload);
    }
  )
);

const fb = config.get("fb") as SocialApp;
passport.use(
  new FacebookStrategy(
    {
      clientID: fb.clientID,
      clientSecret: fb.clientSecret,
      callbackURL: fb.callbackURL
    },
    async (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        if (!accessToken && !profile) {
          return done(
            new Error("Authenticate via facebook failed! Empty access token!")
          );
        }
        return done(undefined, profile);
      });
    }
  )
);

const gg = config.get("gg") as SocialApp;
passport.use(
  new GoogleStrategy(
    {
      clientID: gg.clientID,
      clientSecret: gg.clientSecret,
      callbackURL: gg.callbackURL
    },
    async (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        if (!accessToken && !profile) {
          return done(
            new Error("Authenticate via facebook failed! Empty access token!")
          );
        }
        return done(undefined, profile);
      });
    }
  )
);
