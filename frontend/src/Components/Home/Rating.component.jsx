import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import Card from 'antd/lib/card/Card'
import Stack from '@mui/material/Stack'
import Header from './Header.component'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchAllUsers } from '../../redux/action'


export const Rating = ({state,fetchAllUsers}) => {
    const navigate=useNavigate();
    const [currentBike, setCurrentBike] = useState([])
    const [avgRating, setAvgRating] = useState(-1)
    
    const style={
        'marginTop':'50px'
    }

    useEffect(() => {
      // fetchAllUsers()
      axios.get(`https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes/${parseInt(window.location.pathname.split('/')[1])}`,{
        headers:{
          jwt: JSON.parse(localStorage.getItem('token')).jwt
        }
    })
      .then((data)=>{
        setCurrentBike([data.data])
        if(data.data.rating!==null)
        {
            let tmp=0,num=0;
            Object.keys(JSON.parse(data.data.rating)).forEach((element)=>{
              Object.keys(JSON.parse(data.data.rating)[element]).forEach((elm)=>{
                if(JSON.parse(data.data.rating)[element][elm].rate!==0)
                {
                    tmp+=JSON.parse(data.data.rating)[element][elm].rate
                    num+=1;
                }
              })
            
            }) 
            if(tmp/num<1)
            {
              setAvgRating(0)
            }
            else{
            setAvgRating(tmp/num)
            }
        }
      })
    }, [])
    

    return (state.loading) ? (
        <></>
      ):state.error?(
        <h2>{state.error}</h2>
      ):(
        <div style={{'backgroundColor':'antiqueWhite','height': '100vh'}}>
        <Header/>
        {currentBike.length!==0?(currentBike[0].rating!==null?
        <div>
        {avgRating!==-1?<div>
        {
            [1,2,3,4,5].map((val,key)=>{
                return(key<avgRating)?(
                    <StarIcon 
                    key={key} 
                    color={'success'} 
                    sx={{mt:4}}
                    />
                ):(<StarOutlineIcon 
                    key={key}
                    color={'success'} 
                    sx={{mt:4}}
                    />)
            })
        }
        </div>:''}</div>:<h1>No ratings yet</h1>):''} 

        {currentBike.length!==0?(currentBike[0].rating!==null?<div>
            { 
            currentBike.map((value,key)=>{
                return(currentBike.length!==0)?(
                    ((currentBike[0].rating!==null)?
                    <div key={key}>
                       { 
                        Object.keys(JSON.parse(value.rating)).map((element,k)=>(
                        
                          <div key={k}>
                            {
                              Object.keys(JSON.parse(value.rating)[element]).map((el,kee)=>(JSON.parse(value.rating)[element][el].review!==null)?(
                                <Stack 
                    key={kee} 
                    direction={'row'}
                    justifyContent='center' 
                    sx={{m:1,mt:4,minWidth:200}}
                    > 
                    <div style={{width:'500px','backgroundColor':'white',"padding":'10px','borderRadius':'5px',float:'left'}}> 
                       
                        <div>
                            <li>{JSON.parse(value.rating)[element][el].review}</li>
                            
                        </div>                            </div>
                    </Stack>
                              ):false)
                            }
                          </div>
                            
                        ))
                        } 
                       </div>
                    :'' )
                ):''
            })
        }
        </div>:''):''}
    </div>
  )
}

const mapStateToProps = (state) => {
    return {
        state: state
      }
  }

const mapDispatchToProps = dispatch => {
  return {
    fetchAllUsers: () => dispatch(fetchAllUsers())
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(Rating)