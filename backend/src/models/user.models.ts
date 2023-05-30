// Interfaces

export enum ERole {
  R = 'regular',
  M = 'manager'
}

export interface IUser{
  name: string;
  email: string;
  password: string;
  role:string;
  id: number;
  reserved: string;
  manages: string;

}

