import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      privateKey: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.EXPIRES_IN_SECONDS,
      },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    LocalStrategy,
    PrismaService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
