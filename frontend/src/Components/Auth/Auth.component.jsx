import React, { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button' 
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import Joi from 'joi'
import './Auth.css'
import Login from './Login.component';
import Register from './Register.component';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { connect } from 'react-redux';
import { fetchUser } from '../../redux/action'; 
import LinearProgress from '@mui/material/LinearProgress';


function Auth({fetchUser,state}) {

    const navigate= useNavigate();
const [user, setUser] = useState('')
    const [tokenError, setTokenError] = useState('')
// setUser(state.user)
    useEffect(() => {
        if(localStorage.getItem('token')!==null && localStorage.getItem('token')!==undefined &&
        localStorage.getItem('token')!=='' && JSON.parse(localStorage.getItem('token')).expiry>new Date().getTime())
        {
            fetchUser();
            setTokenError(false)
        }
        else{
            localStorage.clear()
            setTokenError(true)
        }
    }, [])
  



    const [formStatus, setFormStatus] = useState('login')
 
    
    

  return (state.loading)?(<></>):(state.userError==='' && tokenError===false)?(<>{
    navigate('/home')
  }</>):(<>
    <div className='binder'>
    {/* <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box> */}
    <form className='form'>
    
        <Stack>
            <div className='formTop'>
                <div className='loginTop' onClick={()=>{setFormStatus('login')}}>
                    
                    Login
                </div>
                <div className='registerTop' onClick={()=>{setFormStatus('register')}}>
                    Register
                </div>
            </div>
            {formStatus==='login'?<Login/>:<Register formStatus={setFormStatus}/>}
        </Stack>
    </form> 
    </div>
    </>
  )
}

const mapStateToProps = (state) => {
    return {
        state: state
      }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchUser: () => dispatch(fetchUser()),
  
    } 
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(Auth)