import React, { useEffect, useState } from 'react';
import { FaBackward } from "react-icons/fa6";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateUser = () => {
  const users = {
    fname: '',
    lname: '',
    email: '',
    // No password field here, you usually don't pre-fill passwords
  };

  const [user, setUser] = useState(users);
  const navigate = useNavigate();
  const { id } = useParams(); // 1. Get the user ID from the URL

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // 2. Fetch the existing user data when the component loads
  useEffect(() => {
    axios.get(`http://localhost:3000/api/getone/${id}`)
      .then((response) => {
        setUser(response.data); // Pre-fill the state with user data
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error fetching user data", { position: 'top-right' });
      });
  }, [id]);

  // 3. Submit function calls the UPDATE API
  const submitForm = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:3000/api/update/${id}`, user)
      .then((response) => {
        console.log(response);
        toast.success(response.data.message, { position: 'top-right' });
        navigate('/'); // Go back to the main list
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error occurred while updating user", { position: 'top-right' });
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
          <h1 className='text-green-600 font-bold text-4xl text-center'>Update User</h1>
          <form onSubmit={submitForm} className='flex flex-col gap-3'>
            <label htmlFor="fname">First Name: *</label>
            {/* 4. Add 'value' prop to pre-fill the input */}
            <input className='w-full p-2 rounded-md text-black border border-black rounded-md' onChange={inputHandler} type="text" id='fname' name='fname' value={user.fname} required />
            
            <label htmlFor="lname">Last Name: *</label>
            <input className='w-full p-2 rounded-md text-black border border-black rounded-md' onChange={inputHandler} type="text" id='lname' name='lname' value={user.lname} required />
            
            <label htmlFor="email">Email: *</label>
            <input className='w-full p-2 rounded-md text-black border border-black rounded-md' onChange={inputHandler} type="email" id='email' name='email' value={user.email} required />
            
            {/* We don't include the password field for updates
                unless you have a separate "Change Password" feature */}
            
            <button className='bg-purple-600 text-white font-bold p-3 rounded-md hover:scale-105 mt-5 uppercase' type='submit'>Update User</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateUser;