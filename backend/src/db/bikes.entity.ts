import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';


@Entity()
export class Bikes
 {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    model: string;

    @Column()
    color: string;
    
    @Column()
    city: string;

    @Column({
        nullable: true,
    })
    reserver: string;

    @Column({
        nullable: true,
    })
    cancelled: string;

    @Column({
        nullable: true,
    })
    isAvailable: boolean;

    @Column({
        nullable: true,
    })
    rating: string;

   
}