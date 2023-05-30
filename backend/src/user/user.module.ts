import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { BikesService } from 'src/bikes/bikes.service';
import { BikesController } from 'src/bikes/bikes.controller';
import { Bikes } from 'src/db/bikes.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User,Bikes]),
    JwtModule.register({
        secret:'secret',
        signOptions:{expiresIn:'1d'}
    })
  ],
  providers: [UserService,BikesService],
  controllers: [UserController,BikesController]
})
export class UserModule {}