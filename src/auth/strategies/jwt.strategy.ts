/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from './../../user/user.service';

// type JwtPayload = {
//   userId: number;
// }

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_SECRET,
    });
  }

  async validate(payload: any, done: Function) {
    return done(null, payload);
  }
}
