import { Controller, Get, Param, Post,Put, Delete, Body, UseGuards, BadRequestException, Res, Req, UnauthorizedException,  } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { Bikes } from '../db/bikes.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {Response, Request, response} from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Auth } from 'src/utils/auth.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from 'src/models/user.models';
import { Headers } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/db/user.entity';
import * as Joi from 'joi';


const schema = Joi.object({
  model: Joi.string().trim().min(2).max(30).required(),
  color: Joi.string().trim().min(2).max(30).required(),
  city: Joi.string().trim().min(2).max(30).required(),

});

@Controller('/bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService, private jwtService: JwtService) {}
  
  @UseGuards(AuthGuard)
  @Get()
  async index(@Auth() auth,@Headers() headers): Promise<Bikes[]> {
    const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;
      const user = await User.findOne({where: {id}});
    return this.bikesService.findAll(user.role);
  }  

  @UseGuards(AuthGuard)
  @Get('page/:pg')
  async indexPage(@Auth() auth,@Param('pg') pg,@Headers() headers) {
    const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;
      const user = await User.findOne({where: {id}});


      return this.bikesService.findPage(pg,user.role);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  indexUser(@Auth() auth,@Param('id') id): Promise<Bikes[] | string | Bikes> {
    return this.bikesService.find(id);
  } 

  @RoleGuard(ERole.M)
  @UseGuards(AuthGuard)
  @Post('create')
    async create(@Body() bikesData: Bikes): Promise<any> {
  
      const result = schema.validate({model:bikesData.model,color:bikesData.color,city:bikesData.city});

      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }
      return this.bikesService.create({...bikesData, model:bikesData.model.trim(),city:bikesData.city.trim(),color:bikesData.color.trim()});
    }

    @UseGuards(AuthGuard)
    @Post('filter/:pg')
    async filter(@Param('pg') pg,@Body() filterData,@Headers() headers): Promise<any> {

      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;
      const user = await User.findOne({where: {id}});
      
      console.log('applied')
      console.log(user.role)

      if('model' in filterData ===false && 'city' in filterData===false && 'color' in filterData===false && 'minRating' in filterData===false && 'startDate' in filterData===false && 'endDate' in filterData===false)
      {
        throw new BadRequestException('enter valid filters') 
      }

      if(('startDate' in filterData && 'endDate' in filterData==false) || ('startDate' in filterData ===false && 'endDate' in filterData))
      {
        throw new BadRequestException('enter valid filters') 
      }

      return this.bikesService.filter(filterData,pg,user.role);
    }
    @RoleGuard(ERole.M)
    @UseGuards(AuthGuard)
    @Put(':id/updateDetails')
    async updateDetails(@Param('id') id, @Body() bikesData: Bikes): Promise<any> {
        bikesData.id = Number(id);
        console.log('Update #' + bikesData.id)

        if('model' in bikesData===false && 'color' in bikesData===false && 'city' in bikesData===false)
        {
          throw new BadRequestException('Enter valid details')
        }
        return this.bikesService.update(bikesData,id);
    }

    @UseGuards(AuthGuard)
    @Put(':id/updateReserve')
    async updateReserve(@Param('id') id,@Body() dates:any,@Headers() headers): Promise<any> {
      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const userId = decoded.id;
      console.log('dates')
        console.log(dates)
        // bikesData.id = Number(id);
        // console.log('Update #' + bikesData.id)

        if('reservedFrom' in dates===false || 'reservedUntil' in dates===false)
        {console.log('12')
        console.log(dates)
          throw new BadRequestException('Enter valid reservation details')
        }
        else   if(new Date(dates.reservedFrom).getTime()>new Date(dates.reservedUntil).getTime() || new Date(dates.reservedFrom).getTime()<new Date(new Date().toDateString()).getTime() || new Date(dates.reservedUntil).getTime()<new Date(new Date().toDateString()).getTime() || isNaN(new Date(dates.reservedFrom).getTime()) || isNaN(new Date(dates.reservedUntil).getTime()))
        {console.log('23')
        console.log(dates)
          throw new BadRequestException('enter valid date') 
          
        }
        console.log('kj')
        console.log(dates)
        return this.bikesService.updateReservation(dates,id,userId);
    }

    @UseGuards(AuthGuard)
    @Put(':id/cancelReserve')
    async cancelReserve(@Param('id') id,@Body() dates:any,@Headers() headers): Promise<any> {
      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const userId = decoded.id;
      
        // bikesData.id = Number(id);
        console.log('Update #')
console.log(dates)
        if('reservedFrom' in dates===false || 'reservedUntil' in dates===false)
        {
          throw new BadRequestException('Enter valid reservation details')
        }
        else   if(new Date(dates.reservedFrom).getTime()>new Date(dates.reservedUntil).getTime() || new Date(dates.reservedFrom).getTime()<new Date(new Date().toDateString()).getTime() || new Date(dates.reservedUntil).getTime()<new Date(new Date().toDateString()).getTime() || isNaN(new Date(dates.reservedFrom).getTime()) || isNaN(new Date(dates.reservedUntil).getTime()))
        {
          throw new BadRequestException('enter valid date') 
          
        }

        console.log('cancel')
        console.log(dates)
        console.log(id)
        console.log(userId)


        return this.bikesService.cancelReservation(dates,id,userId);
    }

    @UseGuards(AuthGuard)
    @Put(':id/updateRate')
    async updateRate(@Param('id') id, @Body() ratingOrReview:any,@Headers() headers): Promise<any> {
      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const userId = decoded.id;

        if('rate' in ratingOrReview===false && 'review' in ratingOrReview===false )
        {
          throw new BadRequestException('Enter valid ratings')
        }
        
        return this.bikesService.rating(ratingOrReview,id,userId);
    }



    @RoleGuard(ERole.M)
    @UseGuards(AuthGuard)
    @Put(':id/updateAvailable')
    async updateAvailable(@Param('id') id, @Body() bikesData: Bikes): Promise<any> {
        bikesData.id = Number(id);
        console.log('Update #' + bikesData.id)

        if('isAvailable' in bikesData===false)
        {
          throw new BadRequestException('Enter valid Availablity status')
        }
        else if(bikesData.isAvailable!==true && bikesData.isAvailable!==false)
        {
          throw new BadRequestException('Enter valid Availablity status')
        }
        return this.bikesService.update(bikesData,id);
    }
    @RoleGuard(ERole.M)
    @UseGuards(AuthGuard)
    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
     
      return this.bikesService.delete(id);
    }  

}