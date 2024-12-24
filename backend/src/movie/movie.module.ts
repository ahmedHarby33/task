import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MovieService } from './movie.service';
//=============================================
@Module({
  imports: [
    CacheModule.register({
      store: 'memory', // Default store for memory cache, or you can use Redis for production
      ttl: 60 * 60, // Set the TTL (time-to-live) for cache
    }),
  ],
  providers: [MovieService],
})
export class MovieModule {}
