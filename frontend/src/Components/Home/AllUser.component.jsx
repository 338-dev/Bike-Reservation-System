import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from './Header.component'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'
import { fetchAllUsers } from '../../redux/action'
import AddIcon from '@mui/icons-material/Add';
import { Modal } from 'antd';
import TextField from '@mui/material/TextField';
import Joi from 'joi'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export const AllUser = ({state,fetchAllUsers}) => {
    
    const navigate=useNavigate();
    const style={
        'marginTop':'20px'
    }
    const [modalVisible, setModalVisible] = useState(false);
    const [userDeleteModel, setUserDeleteModel] = useState(false)
    const [userEditModel, setUserEditModel] = useState(false)

    const [newUser, setNewUser] = useState({
        name:'',
        email:'',
        password:'',
        role:''
    })
    const [editUser, setEditUser] = useState({
      name:'',
      email:'',
      role:''
  })
  const [editUserId, setEditUserId] = useState('')
  const [deleteUserId, setDeleteUserId] = useState('')


    useEffect(() => {
        fetchAllUsers()
    }, [])
    

    const schema = Joi.object({
        name: Joi.string().trim().min(3).required(),
        email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
        password: Joi.string().trim().min(8).max(30).required(),
        role:Joi.string().trim().required()
      });

      const handleSubmit=()=>{
        const result = schema.validate(newUser);
        
        console.log(result); 
        const { error } = result;
        if (!error) {
            axios.post("https://bike-reserve-sys-bsr-12321.herokuapp.com/user/create", {...newUser,name:newUser.name.trim(),email:newUser.email.trim().toLowerCase()},{
              headers:{
                jwt: JSON.parse(localStorage.getItem('token')).jwt
              }
          })
            .then((data)=>{
     
                 
                
                 fetchAllUsers();
                 setNewUser({
                  name:'',
                  email:'',
                  password:'',
                  role:''
              })
                setModalVisible(false)

                setTimeout(() => {
                  toast.success('User created successfully')              
                }, 2000);
             }).catch((err)=>{
                console.log(err)
                toast.error(err.response.data.message)
             }) 
     
         } else {
        toast.error(result.error.message)
         }
    }

    const userDelete=()=>{
        axios.delete(`https://bike-reserve-sys-bsr-12321.herokuapp.com/user/${deleteUserId}/delete`,{
          headers:{
            jwt: JSON.parse(localStorage.getItem('token')).jwt
          }
      })
        .then((data)=>{
            console.log(data);
            fetchAllUsers();
            setTimeout(() => {
              toast.success('User deleted successfully')              
            }, 2000);

            setUserDeleteModel(false)

        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const handleEditUser=()=>{
      let temp={}
      if(editUser.name.trim()==='' && editUser.email.trim()==='' && editUser.role.trim()==='')
      {
        toast.error('Fill atleast 1 field')
        return;
      }

      if(editUser.name!=='')
      {
        temp={...temp,name:editUser.name.trim()}
      }
      if(editUser.email!=='')
      {
        temp={...temp,email:editUser.email.trim().toLowerCase()}
      }
      if(editUser.role!=='')
      {
        temp={...temp,role:editUser.role.trim()}
      }

      axios.put(`https://bike-reserve-sys-bsr-12321.herokuapp.com/user/${editUserId}/update`,temp,{
        headers:{
          jwt: JSON.parse(localStorage.getItem('token')).jwt
        }
    })
      .then((data)=>{
        setEditUser({
          name:'',
          email:'',
          role:''
      })
      setEditUserId('')
      fetchAllUsers()
      setTimeout(() => {
        toast.success('User successfully updated')        
      }, 2000);
        setUserEditModel(false)
      })
      .catch((err)=>{
        console.log(err)
        toast.error(err.response.data.message)
      })
    }

  return (
    <div style={{'backgroundColor':'antiqueWhite','height': state.allUsers.length<6?'100vh':'100%'}}>
        <Header/> 
    <div>
         

    { 
      state.allUsers.map((element,key)=>(
            
        <Stack 
        direction={'row'} 
        justifyContent='center' 
        sx={{m:1,mt:4}}
        key={key}
        >             
          <Card  
          sx={{  
                  maxWidth: 545, 
                  minWidth:545  
              }}
          >
            <div 
            style={{'display':'flex','position':'relative'}}>
              <CardContent style={{'flex':'1','cursor':'pointer'}}
              onClick={()=>{navigate(`/${element.id}-${key}/Bikes_by_users`);}}>
              <Typography> 
              {element.name}
              </Typography> 
              <Typography color='lightGrey'
              > email: 
              {" "+element.email}
              </Typography> 
              
              
              </CardContent>
              {state.user.email!==element.email?<div style={{'marginTop':'25px','position':'absolute','right':'0'}}>
                <Button onClick={()=>{setUserEditModel(true); setEditUserId(element.id);}}>
                <EditIcon/>
                </Button>
                <Modal
                  title="Edit User"
                  style={{ 
                  top: 20,
                  }}
                  visible={userEditModel}
                  onOk={() => handleEditUser()}
                  onCancel={() =>{setUserEditModel(false);setEditUser({
                    name:'',
                    email:'',
                    role:''
                });}}>
                    <Stack
        justifyContent='center' 
        sx={{m:1,mt:4}}>
        <TextField
          
          id="outlined-required"
          label="Name"
          sx={{ml:6,mr:6}} 
          value={editUser.name} 
          onChange={(e)=>setEditUser({...editUser,name:e.target.value})}
        />
        <br/>
        <TextField
          
          id="outlined-required"
          label="Email"
          sx={{ml:6,mr:6}} 
          value={editUser.email} 
          onChange={(e)=>setEditUser({...editUser,email:e.target.value})}
        />
        <br/>
        <FormControl sx={{m:6,mt:0,mb:0}}>
  <InputLabel id="demo-simple-select-label">Role</InputLabel>
  <Select 
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={editUser.role}
    label="Role"
    onChange={(e)=>setEditUser({...editUser,role:e.target.value})}
  >
    <MenuItem value={'regular'}>Regular</MenuItem>
    <MenuItem value={'manager'}>Manager</MenuItem>
  </Select>
</FormControl>
        </Stack>
                  </Modal>
                  <Button style={{'borderRadius':'20px'}}
                  onClick={()=>{setUserDeleteModel(true); setDeleteUserId(element.id)}}>
                      <DeleteIcon/>
                  </Button>

                  <Modal
                  title="Delete User"
                  style={{ 
                  top: 20,
                  }}
                  visible={userDeleteModel}
                  onOk={() => userDelete()}
                  onCancel={() => setUserDeleteModel(false)}>
                    Do you really want to delete user?
                  </Modal>
                                    
              </div>:''}
              </div>
                    </Card>
                </Stack>
            
        ))
    }
        </div>
        <br />

        <Stack
        direction={'row'} 
        justifyContent='center'>
            
        <div 
        className='btn btn-outline-primary' 
        onClick={()=>setModalVisible(true)}> <span><AddIcon/></span> Create User</div>
        <Modal
        title="Create User"
        style={{  
          top: 20,
        }}
        visible={modalVisible}
        onOk={() => handleSubmit()}
        onCancel={() =>{setModalVisible(false);  setNewUser({
          name:'',
          email:'',
          password:'',
          role:''
      });}}
      >
        <Stack
        justifyContent='center' 
        sx={{m:1,mt:4}}>
        <TextField
          required
          id="outlined-required"
          label="Name"
          sx={{ml:6,mr:6}} 
          value={newUser.name} 
          onChange={(e)=>setNewUser({...newUser,name:e.target.value})}
        />
        <br/>
        <TextField
          required
          id="outlined-required"
          label="Email"
          sx={{ml:6,mr:6}} 
          value={newUser.email} 
          onChange={(e)=>setNewUser({...newUser,email:e.target.value})}
        />
        <br/>
        <TextField
          required
          id="outlined-required"
          label="Password"
          type='password'
          sx={{ml:6,mr:6}} 
          value={newUser.password} 
          onChange={(e)=>setNewUser({...newUser,password:e.target.value})}
        />
        <br/>
        <FormControl required sx={{m:6,mt:0,mb:0}}>
  <InputLabel id="demo-simple-select-label">Role</InputLabel>
  <Select 
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={newUser.role}
    label="Role"
    onChange={(e)=>setNewUser({...newUser,role:e.target.value})}
  >
    <MenuItem value={'regular'}>Regular</MenuItem>
    <MenuItem value={'manager'}>Manager</MenuItem>
    
  </Select>
</FormControl>
        </Stack>
      </Modal>
        </Stack>
        <ToastContainer/>
        <br />

    </div>
  )
}

const mapStateToProps = (state) => {
    return{
        state:state
    }
}
 
const mapDispatchToProps = dispatch => {
    return {
        fetchAllUsers: () => dispatch(fetchAllUsers())  
    } 
  }


export default connect(mapStateToProps, mapDispatchToProps)(AllUser)