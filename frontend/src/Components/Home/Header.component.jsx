import React from 'react'
import Button from '@mui/material/Button' 
import logo from '../../images/logo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'




const Header = ({state}) => {

    const navigate= useNavigate();

    const logOut=()=>{
        localStorage.clear();
        navigate('/auth')
    }

  return (<>
    <div 
    className='header'
    style={{'position':'sticky'}}>
        <img 
        src={logo} 
        alt="logo" 
        width={'200px'} 
        height={'120px'} 
        className='logo'/>
        <h2 
        className='title' 
        onClick={()=>navigate('/home')}
        style={{'width':'10px','cursor':'pointer'}}>
            Nitro 
        </h2> 
        <div  className='logout'>
            <Button 
            variant='outlined' 
            color='error' 
            onClick={()=>{logOut()}}>
                Logout
            </Button>
        </div>
    </div>
    <div style={{'backgroundColor':'antiqueWhite'}}>
    <div 
    className='subheader'>
    <div 
    className='homeButton' 
    onClick={()=>navigate('/home')}>
            Home
    </div>
    <div 
    className='myBikes' 
    onClick={()=>navigate('/my-bikes')}>
        My bikes
    </div>
    {state.user.role!=='regular'?<div 
    className='allUsers' 
    onClick={()=>navigate('/All_User')}>
        All users
    </div>:''}
    </div>
    </div>
</>
  )
}

const mapStateToProps = (state) => {
    return{
        state:state
    }
}

export default connect(mapStateToProps)(Header)