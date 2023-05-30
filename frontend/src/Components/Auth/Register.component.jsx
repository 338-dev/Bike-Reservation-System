import React, { useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button' 
import TextField from '@mui/material/TextField';
import Joi from 'joi';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { connect } from 'react-redux';
import { fetchBikes,fetchUser,fetchAllUsers,fetchBikesWithPages } from '../../redux/action';


const Register=({formStatus,fetchBikes,fetchUser,fetchAllUsers,fetchBikesWithPages,state})=>{
    const navigate=useNavigate()
    const [registerForm, setRegisterForm] = useState({
        name:'',
        email:'',
        password:'',
        role:'regular'
    })

    const schema = Joi.object({
        name: Joi.string().min(2).max(30).required(),
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        password: Joi.string().min(8).max(30).required()
      });

      const handleSubmit=()=>{
        const result = schema.validate({
            name:registerForm.name,
            email:registerForm.email,
            password:registerForm.password
        });
        
        console.log(result); 
        const { error } = result;

        if (!error) {
            axios.post("https://bike-reserve-sys-bsr-12321.herokuapp.com/user/register", 
            {...registerForm,
            email:registerForm.email.toLowerCase()},
            {withCredentials:true})
            .then((data)=>{
     
                toast.success('Signed up successfully')
     
                setTimeout(() => {
                    axios.post("https://bike-reserve-sys-bsr-12321.herokuapp.com/user/login", 
                    {
                        email:registerForm.email.toLowerCase(),
                        password:registerForm.password
                    })
                    .then((response)=>{
     
                        toast.success('Logged in successfully')
                        console.log(response.data)

                        localStorage.setItem('token',
                        JSON.stringify(
                            {
                                jwt:response.data.jwt,
                                expiry:new Date().getTime()+5*3600000,
                                role:response.data.role
                            }))

                        
                       
                        fetchUser();
                      
                        // document.cookie='token=jwt'
                        navigate('/home')
                    }).catch((err)=>{
                        console.log(err)
                        toast.error(err.response.data.message)
                    })                   
                }, 3000);
            }).catch((err)=>{
                console.log(err)
                toast.error(err.response.data.message)
            }) 
     
        } else {
            toast.error(result.error.message)
        }
    }

    return(
        <>
         <br />
        <h1 style={{'fontFamily':'monospace'}}>Register</h1>
    <TextField id="standard-basic1" label="Name" variant="standard" sx={{mt:-5}} value={registerForm.name} onChange={(e)=>setRegisterForm({...registerForm,name:e.target.value})}/>

    <TextField id="standard-basic2" label="Email" variant="standard" type={"email"} sx={{mt:2}} value={registerForm.email} onChange={(e)=>setRegisterForm({...registerForm,email:e.target.value})}/>

    <TextField id="standard-basic3" label="Password" variant="standard" type={'password'} sx={{mt:2,mb:2}} value={registerForm.password} onChange={(e)=>setRegisterForm({...registerForm,password:e.target.value})}/>

    <Button className='submit' sx={{maxWidth:200,m:'auto'}} onClick={()=>{handleSubmit()}}>Submit</Button>
    <ToastContainer/>

    </>
    )
}

const mapStateToProps = (state) => {
    return {
        state: state
      }
  }
  
  const mapDispatchToProps = dispatch => {
    return{
        fetchBikes: () => dispatch(fetchBikes()),
        fetchUser: () => dispatch(fetchUser()),
        fetchAllUsers: () => dispatch(fetchAllUsers()),
        fetchBikesWithPages: () => dispatch(fetchBikesWithPages()),
      }
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(Register)