import React, { useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button' 
import TextField from '@mui/material/TextField';
import Joi from 'joi';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { fetchBikes,fetchUser,fetchAllUsers,fetchBikesWithPages } from '../../redux/action';
import { connect } from 'react-redux';


const Login=({fetchBikes,fetchUser,fetchAllUsers,fetchBikesWithPages,state})=>{
    const navigate=useNavigate()

    const [loginForm, setLoginForm] = useState({
        email:'',
        password:''
    })


    const schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        password: Joi.string().min(8).max(30).required()
      });

      const handleSubmit=()=>{
        const result = schema.validate(loginForm);
        console.log(result); 
        const { error } = result;

        if (!error) {
            axios.post("https://bike-reserve-sys-bsr-12321.herokuapp.com/user/login", {
                email:loginForm.email.toLowerCase(),
                password:loginForm.password
            }).then((data)=>{
     
                 toast.success('Logged in successfully')
                 console.log(data.data)
                localStorage.setItem('token',JSON.stringify({jwt:data.data.jwt,expiry:new Date().getTime()+5*3600000,role:data.data.role}))

                // fetchBikes();
                fetchUser();
                // fetchBikesWithPages();
                // if(JSON.parse(localStorage.getItem('token')).role==='manager'){
                //     fetchAllUsers(); 
                // }
                // document.cookie='token=jwt'
                 navigate('/home')
             }).catch((err)=>{
                console.log(err)
                 toast.error(err.response.data.message)
             }) 
     
         } else {
        toast.error(result.error.message)
         }
    }

    return(<><br />
    <h1 style={{'fontFamily':'monospace'}}>Welcome Back:)</h1>
    <TextField id="standard-basic1" label="Email" type={'email'}variant="standard" sx={{mt:-3}} value={loginForm.email}onChange={(e)=>setLoginForm({...loginForm,email:e.target.value})}/>
    <TextField id="standard-basic2" label="Password" variant="standard" type={'password'} sx={{mt:2,mb:2}} value={loginForm.password} onChange={(e)=>setLoginForm({...loginForm,password:e.target.value})}/>
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
  
  export default connect(mapStateToProps,mapDispatchToProps)(Login)