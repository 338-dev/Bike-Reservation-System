import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';


@Module({
  imports: [UserModule,TypeOrmModule.forRoot({
    type :"sqlite",
    database: "userDB",
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true
  }),JwtModule.register({
    secret: 'secret',
    signOptions: {expiresIn: '1d'}
})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
