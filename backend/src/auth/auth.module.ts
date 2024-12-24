import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma.module'; // Import PrismaModule
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller'; // Ensure you have this import
import { JwtStrategy } from 'src/middleware/jwt.strategy';
import { PrismaService } from 'src/prisma.service';
//================================================
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    PassportModule,
  ],
  providers: [AuthService ,JwtStrategy ,PrismaService],
  controllers: [AuthController], // Ensure AuthController is listed here
  exports: [AuthService], // Export AuthService to use in other parts of the app
})
export class AuthModule {}
