import React, {useEffect,useState} from 'react'
import './Home.css'
import Button from '@mui/material/Button' 
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header from './Header.component'
import CreateBike from './CreateBike.component'
import "antd/dist/antd.css";
import Bikes from './Bikes.component'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { fetchBikes, fetchBikesWithPages, fetchChangedPage, fetchFilteredBikes, fetchUser } from '../../redux/action'
import { connect } from 'react-redux'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { fetchBikesWithDates } from '../../redux/action'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import Pagination from '@mui/material/Pagination';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';


/* eslint-disable */
function Home({fetchUser,fetchBikesWithDates,fetchFilteredBikes,fetchBikesWithPages,fetchChangedPage,fetchBikes,state}) {
    const navigate= useNavigate();
    const [availableDates, setAvailableDates] = useState({
        startDate:'',
        endDate:''
    })
    const [filter, setFilter] = useState({
        model:"",
        color:"",
        city:"",
        minRating:'',
        startDate:'',
        endDate:''
    })

    const [isBikeCreated, setIsBikeCreated] = useState(0)

    const [isDateSet, setIsDateSet] = useState(false)
    let [page, setPage] = useState(1);
    const [isFilterSet, setIsFilterSet] = useState(false)

 

    const bikeCreatedFun=()=>{
      toast.success('Bike created successfully')
    }

    useEffect(() => {
        if(localStorage.getItem('token')!==null && localStorage.getItem('token')!==undefined &&
        localStorage.getItem('token')!=='' && JSON.parse(localStorage.getItem('token')).expiry>new Date().getTime())
        {
            // fetchUser();
            // fetchBikes();

        }
        else{
            localStorage.clear()
            navigate('/auth')
        }
    }, [])


  
    const setDateFilter=()=>{

        const temp={}
        if(isFilterSet===true)
        {    
            if(filter.model!=='')
            {
                temp.model=filter.model.trim().toLowerCase()
            }
            if(filter.city!=='')
            {
                temp.city=filter.city.trim().toLowerCase()
            }
            if(filter.color!=='')
            {
                temp.color=filter.color.trim().toLowerCase()
            }
            if(filter.minRating!=='')
            {
                temp.minRating=filter.minRating
            }
        }
        if(filter.startDate!=='' && filter.endDate!==''  && new Date(filter.startDate).getTime()<=new Date(filter.endDate).getTime())
        {
            temp.startDate=filter.startDate
            temp.endDate=filter.endDate

            setPage(1);
            fetchChangedPage(1)
            fetchFilteredBikes(temp)
            setIsDateSet(true)
        }
        else if(filter.startDate==='' || filter.endDate===''){
            toast.error('Please set both dates')
        }
        else if(new Date(filter.startDate).getTime()>new Date(filter.endDate).getTime())
        {
            toast.error('Start date cannot be less than end date')
        }
        
            
        
        
    }

    const clearDateFilter=()=>{
        

        setFilter({
            ...filter,
            startDate:'',
            endDate:''
        })

        const temp={}
        if(isFilterSet===true)
        {    
            if(filter.model!='')
            {
                temp.model=filter.model.trim().toLowerCase()
            }
            if(filter.city!='')
            {
                temp.city=filter.city.trim().toLowerCase()
            }
            if(filter.color!='')
            {
                temp.color=filter.color.trim().toLowerCase()
            }
            if(filter.minRating!='')
            {
                temp.minRating=filter.minRating
            }
        }

        
        setIsDateSet(false)
        setPage(1);
        fetchChangedPage(1)
        if(Object.keys(temp).length===0)
        {
            fetchChangedPage(1)
            fetchBikesWithPages(1)   
        }
        else{
            fetchFilteredBikes(temp)
        }
        
    }
   
  const handlePageChange = (e, p) => {
    setPage(p);
    fetchChangedPage(p)
    if(isFilterSet===false && isDateSet===false)
    {
        fetchBikesWithPages(p)
    }
    else{
        const temp={}
        if(filter.model!='')
        {
            temp.model=filter.model.trim().toLowerCase()
        }
        if(filter.city!='')
        {
            temp.city=filter.city.trim().toLowerCase()
        }
        if(filter.color!='')
        {
            temp.color=filter.color.trim().toLowerCase()
        }
        if(filter.minRating!='')
        {
            temp.minRating=filter.minRating
        }
        if(filter.startDate!='' && filter.endDate!='' && isDateSet===true)
        {
            temp.startDate=filter.startDate
            temp.endDate=filter.endDate
        }

        fetchFilteredBikes(temp,p)
    }
  };
    // console.log(availableDates)     


    const applyFilter=()=>{

        

        if(JSON.stringify({
            model:filter.model.trim(),
            color:filter.color.trim(),
            city:filter.city.trim(),
            minRating:filter.minRating
        })===JSON.stringify({
            model:"",
            color:"",
            city:"",
            minRating:''
        }))
        {
            toast.error('Please select atleast one filter')
            return 
        }
        setIsFilterSet(true);

        const temp={}
        if(filter.model!='')
        {
            temp.model=filter.model.trim().toLowerCase()
        }
        if(filter.city!='')
        {
            temp.city=filter.city.trim().toLowerCase()
        }
        if(filter.color!='')
        {
            temp.color=filter.color.trim().toLowerCase()
        }
        if(filter.minRating!='')
        {
            temp.minRating=filter.minRating
        }
        if(filter.startDate!='' && filter.endDate!='' && isDateSet===true)
        {
            temp.startDate=filter.startDate
            temp.endDate=filter.endDate
        }
        
        fetchFilteredBikes(temp)
    }

    const clearFilter=()=>{
        setIsFilterSet(false);


        setFilter({
            ...filter,
            model:"",
            color:"",
            city:"",
            minRating:''
        })

        const temp={}

        if(isDateSet===true)
        {
            temp.startDate=filter.startDate
            temp.endDate=filter.endDate

            fetchFilteredBikes(temp)
        }
        else{
            fetchChangedPage(1)
            setPage(1);
            fetchBikesWithPages(1)
        }
    }

  return(state.loading)?(<></>):(state.userError)?(<></>):(<>
    
    <div style={{'backgroundColor':'antiqueWhite','height':state.bikesPages.length<2?'100vh':'100%'}}>
    <Header/>
    <Stack         
    direction="row"
    justifyContent="center"
    >

        {state.user.role==='manager'?<CreateBike email={state.user.email} bikeCreated={bikeCreatedFun}/>:''}
    </Stack>
    <div style={{"backgroundColor":'white','margin':'auto','marginTop':'20px','minWidth':'480px','width':'80%','borderRadius':'10px','paddingTop':'5px'}}>
    <TextField sx={{ m: 1, minWidth: 100 }} id="outlined-basic" label="Search by Model" variant="outlined" name="name" onChange={(e)=>setFilter({...filter,model:e.target.value})} value={filter.model}/>
    <TextField sx={{ m: 1, minWidth: 100 }} id="outlined-basic" label="Search by Color" variant="outlined" name="address" onChange={(e)=>setFilter({...filter,color:e.target.value})} value={filter.color}/>
    <TextField sx={{ m: 1, minWidth: 100}} id="outlined-basic" label="Search by City" variant="outlined" name="name" onChange={(e)=>setFilter({...filter,city:e.target.value})} value={filter.city}/>
    <FormControl sx={{ m: 1, minWidth: 100 }}>

  <InputLabel id="demo-simple-select-label">Rating</InputLabel>
  <Select 
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    name="eventType"
    label="Mode"
    onChange={(e)=>setFilter({...filter,minRating:e.target.value})} value={filter.minRating??""}
  >
    <MenuItem value={''}>No Rating</MenuItem> 
  {
  [1,2,3,4,5].map((rate,k)=>(
    <MenuItem value={rate} key={k}>{">="+rate}</MenuItem>
  ))
  }
  </Select>
</FormControl>

<Stack 
direction="row"   
justifyContent="center">
    <Button onClick={()=>applyFilter()}>Filter</Button>
    <Button color='error' onClick={()=>clearFilter()}>Clear Filter</Button>

</Stack>
</div>
<br />
    <div style={{'marginLeft':'auto'}}>
    <div className='dates'>
        <div className='dateChild1'>
        <LocalizationProvider 
        dateAdapter={AdapterDateFns} >
        <Stack 
        direction="row"   
        justifyContent="center"
        spacing={1}> 
        <MobileDatePicker
                label="Is avilable from"
                inputFormat="dd/MM/yyyy"
                disablePast
                name='date'
                onChange={(e)=>{setFilter({
                  ...filter,
                  startDate:e.toDateString()
                })}}
                value={filter.startDate}
                renderInput={(params) => <TextField {...params} />}
                />
        </Stack> 
        </LocalizationProvider>
        </div>
        <div className='dateChild2'>
        <LocalizationProvider 
        dateAdapter={AdapterDateFns} >
        <Stack 
        direction="row"   
        justifyContent="center"
        spacing={1}
        sx={{m:1}}> 
        <MobileDatePicker
                label="Is avilable until"
                inputFormat="dd/MM/yyyy"
                disablePast
                minDate={new Date(filter.startDate)} 
                name='date'
                onChange={(e)=>{setFilter({
                  ...filter,
                  endDate:e.toDateString()
                })}}
                value={filter.endDate}
                renderInput={(params) => <TextField {...params} />}
                />
        </Stack> 
        </LocalizationProvider>
        </div>
        <div className='datesButton'>    
        <Stack
        direction="row"   
        justifyContent="center">
            <Button onClick={()=>setDateFilter()}>
                Apply dates
            </Button>
            <Button
            color='error'
            onClick={()=>clearDateFilter()}>
            Clear dates
            </Button>
    
        </Stack>
    </div>
    </div>
<br />
    
    </div><br /> 
    <Bikes filter={filter} isDateSet={isDateSet} isFilterSet={isFilterSet}/>
    <ToastContainer/>
    <Stack 
    spacing={2}
    direction={'row'} 
    justifyContent='center' >
      <Pagination 
      count={state.totalPages} 
      color="primary" 
      page={state.currentBikePage}
      onChange={handlePageChange}/>
    </Stack><br />
    </div> 
     
    </>)
}

const mapStateToProps = (state) => {
    return {
        state: state
      }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchUser: () => dispatch(fetchUser()),
      fetchBikesWithDates: (date,filter) => dispatch(fetchBikesWithDates(date,filter)),
      fetchFilteredBikes: (filter,id) => dispatch(fetchFilteredBikes(filter,id)),
      fetchBikesWithPages: (page) => dispatch(fetchBikesWithPages(page)),
       fetchChangedPage: (page) => dispatch(fetchChangedPage(page)),
       fetchBikes: () => dispatch(fetchBikes()),

  
    } 
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(Home)