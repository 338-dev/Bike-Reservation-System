import React, { useEffect,useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../redux/action';
import AllUserComponent from './AllUser.component';
import BikesByUsersComponent from './BikesByUsers.component';
import ReservedByComponent from './ReservedBy.component';


export const Protected = ({state,fetchUser,Component}) => {
    const navigate=useNavigate();
    const [route, setRoute] = useState('')

    useEffect(() => {
        if(localStorage.getItem('token')===null || localStorage.getItem('token')===undefined ||
        localStorage.getItem('token')==='' || JSON.parse(localStorage.getItem('token')).expiry<new Date().getTime())
        {
            localStorage.clear()
            navigate('/auth')
        }

    }, [])

    useEffect(() => {
      setRoute(window.location.pathname)
    }, [])
    
    useEffect(() => {
        if(!state.userError && localStorage.getItem('token')!==null && localStorage.getItem('token')!==undefined &&
        localStorage.getItem('token')!=='')
        {
            let tmp=window.location.pathname;
            
            
            if(state.user.role==='regular')
            {
                console.log(tmp)

                if(tmp.split('/')[tmp.split('/').length-1]==='reservedBy' || tmp.split('/')[tmp.split('/').length-1]=== 'All_User' || tmp.split('/')[tmp.split('/').length-1]==='Bikes_by_users')
                {
                    navigate('/home')
                }
            }
        }
    }, [window.location.pathname])
    

    
    return (state.user.role==='manager')?(<div>{Component}</div>):(state.user.role==='regular'?(route.split('/')[route.split('/').length-1]!=='reservedBy'&& route.split('/')[route.split('/').length-1]!== 'All_User'&& route.split('/')[route.split('/').length-1]!=='Bikes_by_users')?<div>{Component}</div>:<div>You cannot access this route</div>
    :'')

} 

const mapStateToProps = (state) => {
    return{
        state:state
    }
}

const mapDispatchToProps = dispatch => {
    return {
      fetchUser: () => dispatch(fetchUser()),  
    } 
}

export default connect(mapStateToProps, mapDispatchToProps)(Protected)