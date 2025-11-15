import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast'; // Make sure react-hot-toast is imported

const DataScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/getall");
        setUsers(response.data);
      } catch (error) {
        console.log("Error while fetching users:", error);
        toast.error("Could not fetch user data", { position: 'top-right' });
      }
    };

    fetchData();
  }, []);

  // ▼▼▼ NEW DELETE FUNCTION ▼▼▼
  const handleDelete = async (userId) => {
    // Add a confirmation dialog
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/remove/${userId}`);
        // Update the state locally to remove the user from the list
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
        toast.success(response.data.message, { position: 'top-right' });
      } catch (error) {
        console.log("Error while deleting user:", error);
        toast.error("Error deleting user", { position: 'top-right' });
      }
    }
  };
  // ▲▲▲ END OF NEW FUNCTION ▲▲▲

  return (
    <div className="h-screen flex justify-center items-start">
      <div className="p-20 w-[80vw]">
        <Link to={'/add'}>
          <button className="bg-black text-white flex items-center rounded-lg gap-1 px-5 py-2 hover:scale-105 hover:cursor-pointer">
            Add User
          </button>
        </Link>
        <div className="grid grid-cols-[10rem_1fr_1fr_1fr] border mt-10 rounded-lg text-center">
          {/* --- Header Row --- */}
          <div className="border-r p-5 font-bold rounded-tl bg-blue-600 text-white">S No</div>
          <div className="border-r p-5 font-bold bg-blue-600 text-white">User Name</div>
          <div className="border-r p-5 font-bold bg-blue-600 text-white">User Email</div>
          <div className="p-5 font-bold rounded-tr bg-blue-600 text-white">Actions</div>

          {/* --- Dynamic Data Rows --- */}
          {users.map((user, index) => (
            <React.Fragment key={user._id}>
              <div className="border-r border-t p-5">{index + 1}</div>
              <div className="border-r border-t p-5">{user.fname} {user.lname}</div>
              <div className="border-r border-t p-5">{user.email}</div>
              <div className="p-5 border-t flex justify-center gap-3">
                {/* ▼▼▼ ADDED onClick EVENT ▼▼▼ */}
                <MdDelete
                  onClick={() => handleDelete(user._id)} // <-- Call delete function
                  className="hover:cursor-pointer hover:text-red-600 hover:bg-white py-1 w-8 h-8 text-3xl bg-red-500 text-white transition rounded-md duration-700"
                  size={25}
                />
                
                {/* ▼▼▼ WRAPPED ICON IN A LINK ▼▼▼ */}
                <Link to={`/update/${user._id}`}> {/* <-- Link to update page */}
                  <BiSolidEdit className="hover:cursor-pointer hover:text-green-600 hover:bg-white py-1 w-8 h-8 text-3xl bg-green-500 text-white rounded-md transition duration-700" size={25} />
                </Link>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataScreen;