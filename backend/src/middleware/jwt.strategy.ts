import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
//================================================
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService, // Inject your AuthService here
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      secretOrKey: process.env.JWT_SECRET, // Secret key to validate the JWT
    });
  }
  //===============================
  async validate(payload: any) {
    // Here you can check the payload and validate the user from the DB
    return { userId: payload.sub, username: payload.username }; // Modify based on your payload structure
  }
}
