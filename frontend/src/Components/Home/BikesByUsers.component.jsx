import Button from '@mui/material/Button'
import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from './Header.component'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'
import background from '../../images/backGround.jpg'
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import { fetchAllUsers, fetchBikes } from '../../redux/action'
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';



export const BikesByUsers = ({state,fetchAllUsers,fetchBikes}) => {
    const navigate=useNavigate();

    const [isBikeReserved, setIsBikeReserved] = useState(false)

    

    useEffect(() => {
        fetchAllUsers()
        fetchBikes()
    }, [])

    const style={
        'marginTop':'20px'
    }

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 220,
          fontSize: theme.typography.pxToRem(12),
          border: '1px solid #dadde9',
        },
      }));

    

  return(state.loading)?(<></>):(state.error)?(<>{state.error}</>): (
        <div style={{'backgroundColor':'antiqueWhite', 'height': '100vh'}}>  
        <Header/> 

        {state.allUsers.length!==0?<div> 
        { 
            state.bikes.some((value,key,arr)=>{
              if(state.allUsers!=='')
              { 
                if(value.reserver!==null)
                {
                  return (window.location.pathname.split('/')[1].split('-')[0] in JSON.parse(value.reserver) && Object.keys(JSON.parse(value.reserver)[window.location.pathname.split('/')[1].split('-')[0]]).length!==0)
                } 
              }
            })===false?<h1>No bike booked yet</h1>:''
          }</div>:''}


    {state.allUsers.length!==0?<div> 
        { 
            state.bikes.map((value,key)=>(state.allUsers!=='')?(value.reserver!==null?(window.location.pathname.split('/')[1].split('-')[0] in JSON.parse(value.reserver)?<div 
                key={key.toString()}  
                direction={'row'} 
                justifyContent='center'  
                sx={{m:1,mt:10}}>
                 
                
                  
            {Object.keys(JSON.parse(value.reserver)[window.location.pathname.split('/')[1].split('-')[0]]).map((date,k)=>(date.cancelled!==true)?(
                <Stack key={k}
                direction={'row'} 
                justifyContent='center'  
                sx={{m:1,mt:10}}>
                   <Card 
                sx={{  
                    maxWidth: 345, 
                    minWidth:245 
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
                  <HtmlTooltip
        title={
          <React.Fragment>
           {console.log(date)}
            <em>{"from "+date.split('-')[0]}</em> <br />
            <em>{"to "+date.split('-')[1]}</em>
          </React.Fragment>
        }
      >
        <Button>Reservation dates</Button>
      </HtmlTooltip>
                  </CardContent>
                  
                </Card>
<br />
                </Stack>
            ):false)}  
          
                  
            </div>
                
                :''):''):'')
        } 
        </div>:''}
        
    </div>
  )
}

const mapStateToProps = (state) =>{
    return{
        state:state
    }
}

const mapDispatchToProps = dispatch => {
    return {
      fetchAllUsers: () => dispatch(fetchAllUsers()),
      fetchBikes: () => dispatch(fetchBikes()),  

    } 
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(BikesByUsers)