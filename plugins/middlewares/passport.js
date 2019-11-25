import { use } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy, ExtractJwt } from 'passport-jwt';
const JWTStategy = Strategy;
const ExtractJWT = ExtractJwt;
import { parse } from 'toml';

use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false
    },
    async (username, password, callback) => {}
  )
);

use(
  new JWTStategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: parse('services.key_passport')
    },
    async (jwtPayload, callback) => {}
  )
);
