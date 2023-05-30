import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.guard';
import { IUser } from 'src/models/user.models';
import { User } from 'src/db/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  
    constructor(private reflector: Reflector){

    }
  
   async canActivate(
    context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest();
    // console.log(request)
    try{
      const token = request.headers.jwt;
      console.log(token)
      const decoded:any = jwt.verify(token,'secret');
      console.log(decoded)

      const id = decoded.id;
      const user = await User.findOne({where: {id}});
      if(user){
          request.authUser = user;
      }
      return this.isRolesAllowed(user, context);
  }catch(e){
      throw new UnauthorizedException();
  }
  }

  private isRolesAllowed(user, context){
    console.log(user)
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    console.log(roles)
    return roles? roles.includes(user.role) : true;
}
}