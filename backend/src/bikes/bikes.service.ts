import { BadRequestException, HttpException, Injectable, Response } from '@nestjs/common';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Bikes } from '../db/bikes.entity';
import { UpdateResult, DeleteResult } from  'typeorm';
import * as jwt from 'jsonwebtoken'
import { User } from 'src/db/user.entity';


@Injectable()
export class BikesService {
  constructor(
    @InjectRepository(Bikes)
    private bikesRepository: Repository<Bikes>,
) { }



async  findAll(userRole:any): Promise<Bikes[]> {
    let tempBikes= await this.bikesRepository.find();
    if(userRole==='regular')
    {
      return tempBikes.filter((element)=>{
        return element.isAvailable===true;
      })}
    else return tempBikes
}

async  findPage(pg: any,userRole:any) {
  let tempBikes= await this.bikesRepository.find();

  let bikes
  if(userRole==='regular')
  {
    bikes=tempBikes.filter((bike)=>{
    return bike.isAvailable===true
    })
  }
  else{
    bikes=tempBikes;
  }
  return [bikes.slice((pg-1)*4,(pg-1)*4+4),Math.floor((bikes.length-1)/4)+1]
}

async  find(id: any): Promise<Bikes[] | Bikes | string> {
  const bike= await this.bikesRepository.find();
  for(const iter of bike) 
    {
      if(iter.id==id)
      { 
          return iter
      }
    }
    return 'no bike found'
 
}

async  create(bike: Bikes): Promise<Bikes> {    
    return await this.bikesRepository.save(bike);
}

async update(bike: Bikes,id:any): Promise<UpdateResult> {

  const bike1:any = await this.bikesRepository.findOne({where:{id}});

  console.log('bike')

  console.log(bike1)

  if(bike1===null)
  {
    console.log(bike1)
    throw new BadRequestException("Bike doesn't  exist")
  }
    return await this.bikesRepository.update(bike.id, bike);
}

async updateReservation(dates: any,id:any,userId:any): Promise<UpdateResult> {

  const bike1:any = await this.bikesRepository.findOne({where:{id}});
  let allUser=await User.find()

  console.log('bike')

  console.log(bike1)

  if(bike1===null)
  {
    console.log(bike1)
    throw new BadRequestException("Bike doesn't  exist")
  }
  if(bike1.isAvailable===null ||bike1.isAvailable===false)
  {
    console.log(bike1)
    throw new BadRequestException("Bike not available")
  }
  let reserve=bike1.reserver
  let rating=bike1.rating

  if(reserve===null)
    {
      console.log('yoyo')
      return await this.bikesRepository.update(id, {reserver:JSON.stringify({[userId]:{[dates.reservedFrom+'-'+dates.reservedUntil]:true}}),rating:JSON.stringify({[userId]:{[dates.reservedFrom+'-'+dates.reservedUntil]:{rate:0,review:null}}})});
    }
    else{ 

      let qw=Object.keys(JSON.parse(reserve)).every((key:any)=>{

        let user=allUser.findIndex(i=>i.id==key)
        

        if(user===-1)
        {
          return true
        }
        else
        {
           let ert=Object.keys(JSON.parse(reserve)[key]).every((date)=>{
            return ((new Date(date.split('-')[0]).getTime()>new Date(dates.reservedFrom).getTime() && new Date(date.split('-')[0]).getTime()>new Date(dates.reservedUntil).getTime()) || (new Date(date.split('-')[1]).getTime()<new Date(dates.reservedFrom).getTime() && new Date(date.split('-')[1]).getTime()<new Date(dates.reservedUntil).getTime()))
          })
          return ert
        }
      })
      if(qw===false)
      {
        throw new BadRequestException("Cannot reserve bike in given range")
      }

      let tempReserve,tempRating;
      if(userId in JSON.parse(reserve) && JSON.parse(reserve)[userId].length!==0)
      {


        
        if(Object.keys(JSON.parse(reserve)[userId]).every(i=>(new Date(i.split('-')[0]).getTime()>new Date(dates.reservedFrom).getTime() && new Date(i.split('-')[0]).getTime()>new Date(dates.reservedUntil).getTime()) || (new Date(i.split('-')[1]).getTime()<new Date(dates.reservedFrom).getTime() && new Date(i.split('-')[1]).getTime()<new Date(dates.reservedUntil).getTime()))===false)
        {
          throw new BadRequestException('Cannot reserve the bike in the given range')
        }  

        tempReserve={...JSON.parse(reserve)[userId],[dates.reservedFrom+'-'+dates.reservedUntil]:true}
        tempRating={...JSON.parse(rating)[userId],[dates.reservedFrom+'-'+dates.reservedUntil]:{rate:0,review:null}}
      }
      else{
        tempReserve={[dates.reservedFrom+'-'+dates.reservedUntil]:true}
        tempRating={...JSON.parse(rating)[userId],[dates.reservedFrom+'-'+dates.reservedUntil]:{rate:0,review:null}}
      }
      return await this.bikesRepository.update(id, {reserver:JSON.stringify({...JSON.parse(reserve),[userId]:tempReserve}),rating:JSON.stringify({...JSON.parse(rating),[userId]:tempRating})});
  }
}

async cancelReservation(dates: any,id:any,userId:any): Promise<UpdateResult> {


  const bike1:any = await this.bikesRepository.findOne({where:{id}});

  console.log('bike')

  console.log(bike1)

  if(bike1===null)
  {
    console.log(bike1)
    throw new BadRequestException("Bike doesn't  exist")
  }

  let reserve=bike1.cancelled



  let tempVar1=JSON.parse(bike1.reserver)
  let tempVar2=JSON.parse(bike1.rating)
  let tempVar3=JSON.parse(bike1.cancelled)


  console.log(tempVar1)

  if(dates.reservedFrom+'-'+dates.reservedUntil in tempVar1[userId] ===false)
  {
    throw new BadRequestException("Reservation doesn't exist")
  }
  
  delete tempVar1[userId][dates.reservedFrom+'-'+dates.reservedUntil]
  delete tempVar2[userId][dates.reservedFrom+'-'+dates.reservedUntil]

  if(tempVar3===null)
  {
    tempVar3={[userId]:[{reservedFrom:dates.reservedFrom,reservedUntil:dates.reservedUntil}]}
  }
  else if(userId in tempVar3===false)
  {
    tempVar3={...tempVar3,[userId]:[{reservedFrom:dates.reservedFrom,reservedUntil:dates.reservedUntil}]}

  }
  else{
    tempVar3={...tempVar3,[userId]:[...tempVar3[userId],{reservedFrom:dates.reservedFrom,reservedUntil:dates.reservedUntil}]}
  }

  return await this.bikesRepository.update(id,{reserver:JSON.stringify(tempVar1),rating:JSON.stringify(tempVar2),cancelled:JSON.stringify(tempVar3)});  
}

async rating(ratingOrReview,id:any,userId:any): Promise<UpdateResult> {

  const bike1:any = await this.bikesRepository.findOne({where:{id}});
  let allUser=await User.find()

  console.log('bike')

  console.log(bike1)

  if(bike1===null)
  {
    console.log(bike1)
    throw new BadRequestException("Bike doesn't  exist")
  }

  let qw=Object.keys(JSON.parse(bike1.rating)).every((key:any)=>{

    let user=allUser.findIndex(i=>i.id==key)
    

    if(user===-1)
    {
      return true
    }
    else
    {
       let ert=Object.keys(JSON.parse(bike1.rating)[key]).every((date)=>{
        return ((new Date(date.split('-')[0]).getTime()>new Date(ratingOrReview.reservedFrom).getTime() && new Date(date.split('-')[0]).getTime()>new Date(ratingOrReview.reservedUntil).getTime()) || (new Date(date.split('-')[1]).getTime()<new Date(ratingOrReview.reservedFrom).getTime() && new Date(date.split('-')[1]).getTime()<new Date(ratingOrReview.reservedUntil).getTime()))
      })
      return ert
    }
  })
  if(qw===false)
  {
    throw new BadRequestException("Cannot apply bike rating in given range")
  }

  if('rate' in ratingOrReview)
  {
    let rating=bike1.rating
    let reserve=bike1.reserver 

    if(ratingOrReview.rate>5 || ratingOrReview.rate<1 )
    {
    throw new BadRequestException("Invalid rating")

    }

    let x;


        if(userId in JSON.parse(rating) && userId in JSON.parse(reserve))
        {
          if(ratingOrReview.reservedFrom+'-'+ratingOrReview.reservedUntil
          in JSON.parse(reserve)[userId] ===false || ratingOrReview.reservedFrom+'-'+ratingOrReview.reservedUntil
          in JSON.parse(rating)[userId] ===false|| JSON.parse(rating)[userId][ratingOrReview.reservedFrom+'-'+ratingOrReview.reservedUntil].rate!==0)
          {
            throw new BadRequestException('Sorry, Either rating already exist or invalid rating')  

          } /*start*/

          x=JSON.stringify({...JSON.parse(rating),[userId]:{...JSON.parse(rating)[userId],[ratingOrReview.reservedFrom+'-'+ratingOrReview.reservedUntil]:{rate:ratingOrReview.rate,review:JSON.parse(rating)[userId][ratingOrReview.reservedFrom+'-'+ratingOrReview.reservedUntil].review}}})
          
        }
        else{
          throw new BadRequestException("User Id doesn't exist")  
        }
       
    
    console.log(x) 
    return await this.bikesRepository.update(id,{rating:x});  
  }
  else{
        let x;
        let rating=bike1.rating
    let reserve=bike1.reserver 
      if(ratingOrReview.review.trim()==='')
      {
        throw new BadRequestException('Cannot write empty review')  
      }

        if(userId in JSON.parse(rating) && userId in JSON.parse(reserve))
        {
          if(ratingOrReview.reservedFrom+'-'+ratingOrReview.reservedUntil
          in JSON.parse(reserve)[userId] ===false || ratingOrReview.reservedFrom+'-'+ratingOrReview.reservedUntil
          in JSON.parse(rating)[userId] ===false|| JSON.parse(rating)[userId][ratingOrReview.reservedFrom+'-'+ratingOrReview.reservedUntil].review!==null)
          {
            throw new BadRequestException('Sorry, Either review already exist or invalid review')  

          } /*start*/

          x=JSON.stringify({...JSON.parse(rating),[userId]:{...JSON.parse(rating)[userId],[ratingOrReview.reservedFrom+'-'+ratingOrReview.reservedUntil]:{rate:JSON.parse(rating)[userId][ratingOrReview.reservedFrom+'-'+ratingOrReview.reservedUntil].rate,review:ratingOrReview.review.trim()}}})
        }
        else{
          throw new BadRequestException("User Id doesn't exist")  
        }
        
    return await this.bikesRepository.update(id,{rating:x});  
  }

  
  
}

async delete(id: string | number|any| FindOptionsWhere<Bikes>): Promise<DeleteResult> {
  const bike:any = await this.bikesRepository.findOne({where:{id}});

  console.log('bike')

  console.log(bike)

  if(bike===null)
  {
    console.log(bike)
    throw new BadRequestException("Bike doesn't  exist")
  }
    return await this.bikesRepository.delete(id);
}

async  filter(filters:any,pg:any,userRole:any): Promise<Bikes[]> {    

  let allUser=await User.find()

  const checkFilter=(bikeData)=>{
    return (('model' in filters?(bikeData.model.toLowerCase().indexOf(filters.model.trim().toLowerCase())!==-1?true:false):true) && ('color' in filters?(bikeData.color.toLowerCase().indexOf(filters.color.trim().toLowerCase())!==-1?true:false):true) && ('city' in filters?(bikeData.city.toLowerCase().indexOf(filters.city.trim().toLowerCase())!==-1?true:false):true)) 
  }

  const availableFilter=(bikeData)=>{
    return(bikeData.isAvailable===true)
  }

  const dateFilter=(bikeData)=>{
    if(bikeData.reserver===null)
    {
      return true;
    }
    else{
      
      let qw=Object.keys(JSON.parse(bikeData.reserver)).every((key:any)=>{

        let user=allUser.findIndex(i=>i.id==key)
        

        if(user===-1)
        {
          return true
        }
        else
        {
           let ert=Object.keys(JSON.parse(bikeData.reserver)[key]).every((date)=>{
            return ((new Date(date.split('-')[0]).getTime()>new Date(filters.startDate).getTime() && new Date(date.split('-')[0]).getTime()>new Date(filters.endDate).getTime()) || (new Date(date.split('-')[1]).getTime()<new Date(filters.startDate).getTime() && new Date(date.split('-')[1]).getTime()<new Date(filters.endDate).getTime()))
          })
          return ert
        }
      })
      return qw
    }
  }

  let bikes=await this.bikesRepository.find();

  let tempResult=bikes.filter(checkFilter)

  if(userRole==='regular')
  {
    tempResult=tempResult.filter(availableFilter)
  }

  let result;

  if('startDate' in filters && 'endDate' in filters )
  {
    console.log('yoyo')
    if(new Date(filters.startDate).getTime()>new Date(filters.endDate).getTime() || new Date(filters.startDate).getTime()<new Date(new Date().toDateString()).getTime() || new Date(filters.endDate).getTime()<new Date(new Date().toDateString()).getTime() || isNaN(new Date(filters.startDate).getTime()) || isNaN(new Date(filters.endDate).getTime()))
    {
      throw new BadRequestException('enter a valid date') 
      
    }
    else{
    // console.log('result')
    //   console.log(result)
      result=tempResult.filter(dateFilter)
      console.log('result')
      console.log(result)
}
  }
  else{
    result=tempResult
    console.log(result)

  }
  console.log('typeof(filters.minRating)')
console.log(typeof(filters.minRating))
  if('minRating' in filters){
    if(filters.minRating!=='' && typeof(filters.minRating)==='number')
    {
      if(filters.minRating<1 || filters.minRating>5 )
      {
        throw new BadRequestException('enter a valid rating')  
      }
      result=result.filter((ele)=>{ 
        let sumOfRate=0,totalRate=0; 
        if(ele.rating!==null)
        {
          Object.keys(JSON.parse(ele.rating)).forEach((element)=>{

          if(Object.keys(JSON.parse(ele.rating)[element]).length!==0)
          {
            Object.keys(JSON.parse(ele.rating)[element]).forEach((vl)=>{
            if(JSON.parse(ele.rating)[element][vl].rate!==null && JSON.parse(ele.rating)[element][vl].rate!==0 && JSON.parse(ele.rating)[element][vl].rate!==undefined && JSON.parse(ele.rating)[element][vl].rate!=='')
            {
              sumOfRate+=JSON.parse(ele.rating)[element][vl].rate;
              totalRate+=1;
            }
          })}

          // console.log(totalRate)
          })
          if(sumOfRate/totalRate>=filters.minRating)
          {
            return true;
          }
        }
      })
    }
    else if(filters.minRating==='' || typeof(filters.minRating)!=='number')
    {
      throw new BadRequestException('enter a valid rating')  
    }
  }

   return [result.slice((pg-1)*4,(pg-1)*4+4),Math.floor((result.length-1)/4)+1]
}

}