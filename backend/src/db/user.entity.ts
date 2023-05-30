import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';


@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    role: string;
    
    @Column()
    email: string;

    @Column()
    password: string;

  
    toJSON(){
        return {
            id: this.id,
            role: this.role,
            email: this.email,
            name: this.name,
            password: this.password,

        };
      }
}