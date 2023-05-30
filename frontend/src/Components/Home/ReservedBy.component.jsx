import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchAllUsers, fetchBikes } from '../../redux/action'
import Header from './Header.component'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import Modal from 'antd/lib/modal/Modal';


export const ReservedBy = ({state,fetchAllUsers,fetchBikes}) => {

    const navigate=useNavigate();
    const [currentBike, setCurrentBike] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);

    const style={
        'marginTop':'30px'
    }

    useEffect(() => {
      fetchAllUsers();
    }, [])

    useEffect(() => {
        axios.get(`https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes/${parseInt(window.location.pathname.split('/')[1])}`,{
            headers:{
              jwt: JSON.parse(localStorage.getItem('token')).jwt
            }
        })
        .then((data)=>{
          setCurrentBike([data.data])
  console.log(currentBike)
          
        })
      }, [])



  return (<>
    <div style={{'backgroundColor':'antiqueWhite','height': '100vh'}}>

    <Header/>
    {currentBike.length!==0?(currentBike[0].reserver!==null?<div>
    {
        state.allUsers.map((element,key)=>(
            <div>
            {element.id in JSON.parse(currentBike[0].reserver) && JSON.parse(currentBike[0].reserver)[element.id].length!==0?<div key={key}>
            {Object.keys(JSON.parse(currentBike[0].reserver)[element.id]).map((date,k)=>(

             
                <Stack   
            direction={'row'} 
            justifyContent='center'  
            sx={{m:1,mt:4}}
            key={k}>             
                <Card sx={{  
                        maxWidth: 545, 
                        minWidth:545  
                        }}>
                            <CardContent>
                            
                            <Typography style={{'position':'absolute'}}> 
                            from{" "+date.split('-')[0]}
                            </Typography>  
                            <Typography style={{'position':'absolute','marginTop':'20px'}}> 
                            to{" "+date.split('-')[1]}
                            </Typography>  
                            <Typography
                            > 
                            {" "+state.allUsers[state.allUsers.findIndex(i=>i.id===element.id)].name}
                            </Typography> 
                            </CardContent>
                </Card> 
            </Stack>)) }</div>:''}</div>
        )) 
    }
    </div>:<h1>Bike not reserved yet</h1>):''}
    </div>
    </>)
}

const mapStateToProps = (state) => {
    return{
        state:state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUsers: () => dispatch(fetchAllUsers()),
        fetchBikes: () => dispatch(fetchBikes())   
    } 
  }

export default connect(mapStateToProps, mapDispatchToProps)(ReservedBy)