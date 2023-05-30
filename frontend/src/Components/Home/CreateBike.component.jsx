import React,{useState} from 'react'
import Button from '@mui/material/Button' 
import {Modal} from 'antd'
import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import Joi from 'joi'
import { toast, ToastContainer } from "react-toastify";
import { fetchBikes, fetchBikesWithPages } from '../../redux/action';
import { connect } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';


const CreateBike = ({email,fetchBikes,bikeCreated,fetchBikesWithPages}) => {
    const [visible, setVisible] = useState(false)

    const [bikeDetails, setBikeDetails] = useState({
      model:"",
      color:"",
      city:"",
    })
    
    const schema = Joi.object({
      model: Joi.string().trim().min(2).max(30).required(),
      color: Joi.string().trim().min(2).max(30).required(),
      city: Joi.string().trim().min(2).max(30).required(),
    });


    const createBike=()=>{
      setBikeDetails({
        model:bikeDetails.model.trim(),
        color:bikeDetails.color.trim(),
        city:bikeDetails.city.trim()
      })
      const result = schema.validate(bikeDetails);
      console.log(result); 
      const { error } = result;

      if(!error)
      {
        axios.post("https://bike-reserve-sys-bsr-12321.herokuapp.com/bikes/create",bikeDetails,{
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
            fetchBikesWithPages()
            setVisible(false)

            
            setTimeout(() => {
              bikeCreated()              
            }, 2000);

        })
        .catch((err)=>{
          console.log(err)
        })
      }
      else{
        toast.error(result.error.message)
      }
    }

  return (
    <div className='createBike'>
        <Button 
        onClick={() => setVisible(true)}>
            Create bike
            <AddIcon/>
        </Button>

        <Modal
        title="Add new bike"
        centered
        visible={visible}
        onOk={() => {createBike()}}
        onCancel={() => {setVisible(false); setBikeDetails({
          model:"",
          color:"",
          city:"",
        })}}
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
    fetchBikes: () => dispatch(fetchBikes()),
    fetchBikesWithPages: () => dispatch(fetchBikesWithPages()),

  } 
}

export default connect(mapStateToProps,mapDispatchToProps)(CreateBike)