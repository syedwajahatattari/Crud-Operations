import React from 'react'
import { FaBackward } from "react-icons/fa6";
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


const AddUser = () => {
  const users = {
    fname: '',
    lname: '',
    email: '',
    password: ''
  };

  const [user, setUser] = useState(users);
  const navigate = useNavigate();
  const inputHandler = (e) => {
    const {name, value} = e.target;
    setUser({...user, [name]: value});
  };

  const submitForm = async(e) => {
    e.preventDefault();
    console.log("Submitting this user:", user);
    await axios.post("http://localhost:3000/api/create", user)
    .then((response) => {
      console.log(response);
      toast.success(response.data.message, {position:'top-right'});
      navigate('/');
    })
    .catch ((error) => {
      console.log(error);
      toast.error("Error occurred while adding user", {position:'top-right'});
    });
  }
  return (
    <div className='h-screen flex justify-center items-start'>
        <div className='w-[40vw] p-20'>
          <Link to={'/'}>
            <div className='bg-black text-white flex items-center rounded-lg w-24 gap-1 px-5 py-2 hover:scale-105 hover:cursor-pointer'>
                <FaBackward /> 
            <button className=''>Back</button>
            </div>
            </Link>
            <div className='flex flex-col mt-10 gap-5'>
              <h1 className='text-green-600 font-bold text-4xl text-center'>Add New User</h1>
              <form onSubmit={submitForm} className='flex flex-col gap-3'>
                <label htmlFor="fname">First Name: *</label>
                <input className='w-full p-2 rounded-md text-black border border-black rounded-md' onChange={inputHandler} type="text" id='fname' name='fname' required />
                <label htmlFor="lname">Last Name: *</label>
                <input className='w-full p-2 rounded-md text-black border border-black rounded-md' onChange={inputHandler} type="text" id='lname' name='lname' required />
                <label htmlFor="email">Email: *</label>
                <input className='w-full p-2 rounded-md text-black border border-black rounded-md' onChange={inputHandler} type="email" id='email' name='email' required />
                <label htmlFor="password">Password: *</label>
                <input className='w-full p-2 rounded-md text-black border border-black rounded-md' onChange={inputHandler} type="password" id='password' name='password' required />
                <button className='bg-purple-600 text-white font-bold p-3 rounded-md hover:scale-105 mt-5 uppercase' type='submit'>Add User</button>
              </form>
            </div>
        
        </div>
        
    </div>
  )
}

export default AddUser