import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as cors from 'cors';
import * as session from 'express-session';

import { AuthModule } from './auth/auth.module';
import { InstrumentController } from './instrument/instrument.controller';
import { LocationController } from './location/location.controller';
import { MusicController } from './music/music.controller';
import { UserController } from './user/user.controller';
import { InstrumentService } from './instrument/instrument.service';
import { LocationService } from './location/location.service';
import { MusicService } from './music/music.service';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [
    InstrumentController,
    LocationController,
    MusicController,
    UserController,
    AppController,
  ],
  providers: [
    InstrumentService,
    LocationService,
    MusicService,
    UserService,
    PrismaService,

    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: process.env.KEY_SECRET_SESSION,
          resave: false,
          saveUninitialized: true,
          cookie: { secure: true },
        }),
        cors({
          origin: '*',
        }),
      ) // Aplica o middleware cors
      .forRoutes('*'); // Habilita o CORS para todas as rotas
  }
}
