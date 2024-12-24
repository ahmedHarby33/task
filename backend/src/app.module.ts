import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { MovieService } from './movie/movie.service';
import { MovieController } from './movie/movie.controller';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    CacheModule.register({
      ttl:3600, // 1 hour in seconds
      max: 100, // Optional: Set the max items in cache
    }),
  ],

  controllers: [AppController, MovieController],
  providers: [AppService, PrismaService, MovieService,JwtService],
})
export class AppModule {}
