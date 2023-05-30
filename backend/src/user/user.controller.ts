import { Controller, Get, Param, Post,Put, Delete, Body, UseGuards, BadRequestException, Res, Req, UnauthorizedException,  } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../db/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {Response, Request, response} from 'express';
import { request } from 'http';
import JwtUtil from 'src/utils/jwt.util';
import { AuthGuard } from 'src/guards/auth.guard';
import { ERole } from 'src/models/user.models';
import { RoleGuard } from 'src/guards/role.guard';
import { Headers } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as Joi from 'joi';


const schema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(30).required(),
  role:Joi.string().valid('regular').valid('manager').required(),
  name: Joi.string().trim().min(2).max(30).required(),

});

const schemaRegister = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().trim().min(8).max(30).required(),
  name: Joi.string().trim().min(2).max(30).required(),

});

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}
  
  @RoleGuard(ERole.M)
  @UseGuards(AuthGuard)
  @Get()
  index(): Promise<User[]> {
    return this.userService.findAll();
  }  

 
  @UseGuards(AuthGuard)
  @Get('verify')
    async user(@Headers() headers) {
      // console.log('headers')

      console.log(headers)
      try{
      const token = headers.jwt;
      const decoded:any = jwt.verify(token,'secret');
      const id = decoded.id;
      const user = await User.findOne({where: {id}});
      if(user){
          const {password, ...result} = user;

        return {result};
      }
    }catch(e){
      throw new UnauthorizedException();
    }
      
    }

  @RoleGuard(ERole.M)
  @UseGuards(AuthGuard)
  @Get(':id')
  indexUser(@Param('id') id): Promise<User[] | string | User> {
    return this.userService.find(id);
  } 

  @Post('register')
    async register(@Body() userData: User): Promise<any> {
      const {name,email,password} =userData;

      
      
      const result = schemaRegister.validate({name:name,email:email,password:password});

      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }

      const hashedPassword= await bcrypt.hash(password,12)
      return this.userService.create({...userData, password:hashedPassword,name:userData.name.trim(),email:userData.email.trim().toLowerCase(),role:'regular'});
    }

    @RoleGuard(ERole.M)
    @UseGuards(AuthGuard)
    @Post('create')
    async create(@Body() userData: User): Promise<any> {
      const {name,email,password,role} =userData;

      
      
      const result = schema.validate({name:name,email:email,password:password,role:role});

      const { error } = result;
      if(error)
      {
        throw new BadRequestException(result.error.message)
      }

      const hashedPassword= await bcrypt.hash(password,12)
      return this.userService.create({...userData, password:hashedPassword,name:userData.name.trim(),email:userData.email.trim().toLowerCase()});
    }
    
    @RoleGuard(ERole.M)
    @UseGuards(AuthGuard)
    @Put(':id/update')
    async update(@Param('id') id, @Body() userData: User): Promise<any> {
        userData.id = Number(id);
        console.log('Update #' + userData.id)
        
        
      if(userData.name!==undefined)
      {
        let tempSchema=Joi.object({
          name:Joi.string().trim().min(1).required()
        });
        const result = tempSchema.validate({name:userData.name})

        const { error } = result;
        if(error)
        {
          throw new BadRequestException(result.error.message) 
        }

      }
      if(userData.email!==undefined)
      {
        let tempSchema=Joi.object({
          email: Joi.string().email({ tlds: { allow: false } }).required(),
        });
        const result = tempSchema.validate({email:userData.email})

        const { error } = result;
        if(error)
        {
          throw new BadRequestException(result.error.message)
        }
      }
      if(userData.role!==undefined)
      {
        let tempSchema=Joi.object({
          role:Joi.string().valid('regular').valid('manager').required(),
        });
        const result = tempSchema.validate({role:userData.role})

        const { error } = result;
        if(error)
        {
          throw new BadRequestException(result.error.message)
        }
      }

        return this.userService.update(userData);
    }
    
    @RoleGuard(ERole.M)
    @UseGuards(AuthGuard)
    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
      return this.userService.delete(id);
    }  

    @Post('login')
    async userLogin(@Body() {email, password}:{email:string; password:string},
    @Res({passthrough:true}) response:Response)
    {
      const tempEmail=email.trim().toLowerCase();
      const tempSchema = Joi.object({
        email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
        password: Joi.string().min(8).max(30).required()})

      const result = tempSchema.validate({email:tempEmail,password:password})

        const user=await  this.userService.userLogin({tempEmail});
        const { error } = result;
        if(error)
        {
          throw new BadRequestException(result.error.message)
        }
        if(!user || !await bcrypt.compare(password,user.password))
        {
            throw new BadRequestException('invalid credentials')
        }

        const token = JwtUtil.getJwtToken(user)
      
      return {
        ...user.toJSON(),
        jwt: token
      };

     }
    //  @UseGuards(AuthGuard)
    //  @Post('logout')
    // async logout(@Res({passthrough: true}) response: Response,@Req() request:Request) {
    //   console.log(request)
    //     response.clearCookie('jwt');

    //     return {
    //         message: 'cleared', 
    //     }
    // }


}
