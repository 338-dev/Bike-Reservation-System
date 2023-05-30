import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Card } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import { connect } from 'react-redux';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import StarIcon from '@mui/icons-material/Star';
import background from '../../images/backGround.jpg'
import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from 'antd/lib/modal/Modal';
import { fetchBikes, fetchBikesWithPages, fetchFilteredBikes, fetchUser } from '../../redux/action';
import TextField from '@mui/material/TextField';
import Joi from 'joi'
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function Bikes({state,filter,fetchBikes,fetchBikesWithPages,isDateSet,isFilterSet,fetchFilteredBikes}) {
  const navigate=useNavigate();
  const [bikes, setBikes] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visible, setVisible] = useState(false)

    const [bikeDetails, setBikeDetails] = useState({
      model:"",
      color:"",
      city:"",
    })
    const [editBikeId, seteditBikeId] = useState('')
    const [deleteBikeId, setDeleteBikeId] = useState('')
    const [isBikeReserved, setIsBikeReserved]=useState([false,-1])

    useEffect(() => {
      fetchUser()
      fetchBikesWithPages();
    }, [])
    

  const reserve=(id,reserve)=>{

    if(isDateSet===false)
    {
      toast.error('Please select dates')
      return
    }

    
    axios.put(`https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes/${id}/updateReserve`,{
      reservedFrom:filter.startDate,
      reservedUntil:filter.endDate
    },{
      headers:{
        jwt: JSON.parse(localStorage.getItem('token')).jwt
      }
  })
    .then((data)=>{
      setIsBikeReserved([true,id])
      toast.success('Successfully reserved')
       
     })
     .catch((err)=>{
      console.log(err)
     })
}

  const updateBike=()=>{
 

    if(bikeDetails.model.trim()==='' && bikeDetails.city.trim()==='' && bikeDetails.color.trim()==='' )
    {
      toast.error('All 3 fields cannot be empty')
    }
    else 
    {
      let temp={};
      if(bikeDetails.model!=='')
      {
        temp={...temp,model:bikeDetails.model.trim()}
      }
      if(bikeDetails.city!=='')
      {
        temp={...temp,city:bikeDetails.city.trim()}
      }
      if(bikeDetails.color!=='')
      {
        temp={...temp,color:bikeDetails.color.trim()}
      }
      axios.put(`https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes/${editBikeId}/updateDetails`,temp,{
        headers:{
          jwt: JSON.parse(localStorage.getItem('token')).jwt
        }
    })
      .then((data)=>{
        
          console.log(data)
          setBikeDetails({
            model:"",
            color:"",
            city:"",
          })
          fetchBikes();
          
          setVisible(false)
          setTimeout(() => {
            toast.success('Bike edited successfully')              
          }, 2000);
      })
      .catch((err)=>{
        console.log(err)
      toast.error(err)

      }) 
    }
    
  }


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (id,reserve) => {
    axios.delete(`https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes/${deleteBikeId}/delete`,{
      headers:{
        jwt: JSON.parse(localStorage.getItem('token')).jwt
      }
  })
    .then(response => {
      fetchBikes()
    })
    .catch((err)=>{
      toast.error(err.message)
    })
    setIsModalVisible(false);
    setTimeout(() => {
      toast.success('Bike Deleted Successfully')      
    }, 2000);

  };

  const changeAvailableStatus=(id,isAvailable)=>{
    axios.put(`https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes/${id}/updateAvailable`,{isAvailable:!isAvailable},{
      headers:{
        jwt: JSON.parse(localStorage.getItem('token')).jwt
      }
  })
  .then((data)=>{
    if(!isFilterSet && !isDateSet)
      fetchBikesWithPages(state.currentBikePage);
    else{

      const temp={}
        if(isFilterSet===true)
        {    
            if(filter.model!=='')
            {
                temp.model=filter.model.toLowerCase()
            }
            if(filter.city!=='')
            {
                temp.city=filter.city.toLowerCase()
            }
            if(filter.color!=='')
            {
                temp.color=filter.color.toLowerCase()
            }
            if(filter.minRating!=='')
            {
                temp.minRating=filter.minRating
            }
        }
        if(isDateSet)
        {
          if(filter.startDate!=='' && filter.endDate!=='')
          {
            temp.startDate=filter.startDate
            temp.endDate=filter.endDate
          }
        }
        console.log(temp)

      fetchFilteredBikes(temp,state.currentBikePage)
    }
    setTimeout(() => {
      if(isAvailable===null || isAvailable===false ) 
      {
        toast.success('Bike made available')
      }
      else{
        toast.success('Bike made unavailable')
      }
     
    },2000)
      

  })
  .catch((err)=>{
    console.log(err)
  })
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (state.bikesPagesLoading) ? (
    <><CircularProgress/></>
  ):state.bikesPagesError?(
    <h2>{state.error}</h2>
  ):( 
    <>  


   {state.bikesPages.length!==0?   
   <div className='parentBike'>   
    {
        state.bikesPages.map((value,key)=>{
            return(state.bikesPages.length!==0)?( 
               
              <div key={key.toString()}>
 
              
              <Stack  
              direction={'row'} 
              justifyContent='center' 
              spacing={'2'}
               >
      
    <Card 
    
    sx={{  
        maxWidth: 445, 
        minWidth:300 
        }}>
          <CardMedia
        component="img"
        height="140"
        image={background}
      />
      
      <CardContent>
        <Typography 
        gutterBottom variant="h5" 
        component="div">
          {value.model}
        </Typography>
        <Typography 
        gutterBottom 
        component="div">
          {value.color}
        </Typography>
        {state.user.role==='manager'?(value.isAvailable===null || value.isAvailable===false?<Button> <CheckCircleOutlineIcon color='success' onClick={()=>changeAvailableStatus(value.id,value.isAvailable)}/></Button>:<Button><CheckCircleIcon color='success' onClick={()=>changeAvailableStatus(value.id,value.isAvailable)}/></Button>):false} 
<br /> 
        <Link href='#' onClick={()=>navigate(`/${value.id}/rating`)} >Reviews</Link>
<br />
        {state.user.role==='manager'?<Link href='#' onClick={()=>navigate(`/${value.id}/reservedBy`)} >See who booked</Link>:''}
        <Box  
        sx={{ 
            display: 'flex', 
            alignItems: 'flex-end' 
            }}>
        <LocationOnIcon 
        sx={{ 
            color: 'action.active', 
            mr: 1, 
            my: 0.5 
            }} />
        <Typography 
        gutterBottom 
        component="div"> 
          {value.city}
        </Typography>

      </Box>
      {state.user.role==='manager'?<Stack  
      direction="row"
      justifyContent="center">
      <Button 
        size="small" onClick={()=>{setVisible(true);seteditBikeId(value.id)}}>
            <EditIcon style={{'width':'50%'}}/>
        </Button>
        <Modal
        title="Update bike"
        centered
        visible={visible}
        onOk={() => {updateBike()}}
        onCancel={() => {setVisible(false); setBikeDetails({
          model:"",
          color:"",
          city:"",
        });}}
        width={500}
      >
        <Stack 
        direction={'row'} 
        justifyContent='center' 
        sx={{m:1}}>
          <TextField 
          id="outlined-basic" 
          label="Model" 
          variant="outlined" 
          name='Model'
          onChange={(e)=>{setBikeDetails({
            ...bikeDetails,
            model:e.target.value
          })}}
          value={bikeDetails.model}/>

        </Stack>

        <Stack 
        direction={'row'} 
        justifyContent='center' 
        sx={{m:1}}>

          <TextField 
          id="outlined-basic" 
          label="Color" 
          variant="outlined" 
          name='Color' 
          onChange={(e)=>{setBikeDetails({
            ...bikeDetails,
            color:e.target.value
          })}}
          value={bikeDetails.color}/>
        
        </Stack>

        <Stack 
        direction={'row'} 
        justifyContent='center' 
        sx={{m:1}}>
          <TextField 
          id="outlined-basic" 
          label="Location" 
          variant="outlined" 
          name='Location' 
          onChange={(e)=>{setBikeDetails({
            ...bikeDetails,
            city:e.target.value
          })}}
          value={bikeDetails.city}/>
        </Stack>

        <ToastContainer/>
        

    
      </Modal>
        <Button 
        onClick={()=>{showModal();setDeleteBikeId(value.id)}}>
          <DeleteIcon color='error'style={{'width':'50%'}}/>
        </Button>
        <Modal 
        title="Delete Bike" 
        visible={isModalVisible} 
        onOk={()=>handleOk()} 
        onCancel={()=>handleCancel()}>
        <p>Do you really want to delete the bike?</p>
      </Modal>
      </Stack>:''}
      </CardContent>
      {value.isAvailable && isDateSet && isBikeReserved[1]!==value.id && <CardActions sx={{m:'auto'}}> 
        <Stack 
        direction={'row'} 
        justifyContent='center' >
          <Button 
          onClick={()=>{reserve(value.id,value.reserver); setIsBikeReserved([false,-1])}}>
            Reserve
        </Button>
        </Stack>
      </CardActions>}
    </Card> 
    </Stack>
<br /> 
    </div>
            
            ):'' 
        }) 
 
    }
</div>:(isFilterSet || isDateSet)?<h1>No bike available in given range</h1>:<h1>No bike available yet</h1>}
 
    


    </>
  )
}

const mapStateToProps = (state) => {
    return{
      state:state
    }
  }
  const mapDispatchToProps = dispatch => {
    return {
      fetchBikes: () => dispatch(fetchBikes()),
      fetchBikesWithPages: (pg) => dispatch(fetchBikesWithPages(pg)),
      fetchFilteredBikes: (filter,pg) => dispatch(fetchFilteredBikes(filter,pg)),

    } 
  }
  
export default connect(mapStateToProps,mapDispatchToProps)(Bikes)
  
  