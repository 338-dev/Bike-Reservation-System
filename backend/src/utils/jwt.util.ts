import { IUser } from 'src/models/user.models';
import * as jwt from 'jsonwebtoken';
import { User } from "src/db/user.entity";

export default class JwtUtil {

    static getJwtToken(user: User){
        const token = jwt.sign({id: user.id, time: Date.now()},'secret',{
            expiresIn: '5h',
          });
          return token;
    }
}