import './App.css';
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import Auth from './Components/Auth/Auth.component';
import Home from './Components/Home/Home.component';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { fetchBikes, fetchUser, fetchAllUsers, fetchBikesWithPages } from './redux/action';
import MyBikesComponent from './Components/Home/MyBikes.component';
import RatingComponent from './Components/Home/Rating.component';
import ReservedByComponent from './Components/Home/ReservedBy.component';
import BikesByUsersComponent from './Components/Home/BikesByUsers.component';
import AllUserComponent from './Components/Home/AllUser.component';
import ProtectedComponent from './Components/Home/Protected.component';



function App({fetchBikes,fetchUser,fetchAllUsers,fetchBikesWithPages,state}) {


  useEffect(() => { 
    fetchUser()
  }, [])
  
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<ProtectedComponent Component={<Home/>}/> }/>
          <Route path="/home" element={<ProtectedComponent Component={<Home/>}/> }/>
          <Route path="/auth" index element={<Auth/>}/>
          <Route path="/my-bikes" element={<ProtectedComponent Component={ <MyBikesComponent/>}/> }/>
          <Route path="/:id/rating" element={<ProtectedComponent Component={ <RatingComponent/>}/> }/>
          <Route path="/:id/reservedBy" element={<ProtectedComponent Component={ <ReservedByComponent/>}/> }/>
          <Route path="/All_User" element={<ProtectedComponent Component={ <AllUserComponent/>}/> }/>
          <Route path="/:id/Bikes_by_users" element={<ProtectedComponent Component={ <BikesByUsersComponent/>}/> }/>

        </Routes>
    </div>
  );
}




const mapStateToProps = (state) => {
  return{
    state:state
  }
}

const mapDispatchToProps = dispatch =>{
  return{
    fetchBikes: () => dispatch(fetchBikes()),
    fetchUser: () => dispatch(fetchUser()),
    fetchAllUsers: () => dispatch(fetchAllUsers()),
    fetchBikesWithPages: () => dispatch(fetchBikesWithPages()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)


