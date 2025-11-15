import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 

// --- Configuration ---
// Base URL for your Express APIs
const API_BASE_URL = 'http://localhost:3000/api/enquiry'; 

// --- Helper component for Form Inputs (Updated to accept error) ---
// Renders the label, input, and specific validation error message if present.
function FormInput({ label, id, value, onChange, placeholder, type = 'text', error }) { 
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // Highlight border on error
        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`} 
        required
      />
      {/* Display specific error message */}
      {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>} 
    </div>
  );
}

// --- Main App Component ---
export default function UserEnquiry() {
  const [enquiries, setEnquiries] = useState([]); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); // General Network Error state

  // NEW: State for field-specific validation errors
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  // --- API Functions ---
  
  // GET ALL: Fetches all enquiries from the backend
  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await axios.get(`${API_BASE_URL}/getall`);
      setEnquiries(response.data || []); 
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
         setError('Could not connect to the backend server (http://localhost:5000). Please ensure your Node.js server is running.');
      } else {
         setError(error.message);
      }
      setEnquiries([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // --- Event Handlers ---

  // Handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear specific errors when user starts typing again
    if (name === 'email') setEmailError(null);
    if (name === 'phone') setPhoneError(null);
  };

  // Function to clear the form and reset editing state
  const resetForm = () => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      setEditingId(null);
      setEmailError(null);
      setPhoneError(null);
  }
  
  // VALIDATION LOGIC
  const validateForm = () => {
      let isValid = true;
      setEmailError(null);
      setPhoneError(null);

      // Email Validation: Simple check for email structure (user@domain.ext)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
          setEmailError('Please enter a valid email address (e.g., user@domain.com).');
          isValid = false;
      }

      // Phone Validation: Must contain 7-15 digits only
      // Allows for flexibility while keeping it numeric
      const phoneRegex = /^\d{7,15}$/; 
      if (!phoneRegex.test(formData.phone)) {
          setPhoneError('Phone must be between 7 and 15 digits and contain only numbers (0-9).');
          isValid = false;
      }
      
      return isValid;
  };


  // Handle form submission (Save/Update) - MODIFIED FOR VALIDATION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Run Validation. If it fails, stop the function.
    if (!validateForm()) {
        return; 
    }
    
    // Proceed to API call if valid
    setLoading(true);
    setError(null);

    try {
        if (editingId) {
            // UPDATE: PUT request to /update/:id
            await axios.put(`${API_BASE_URL}/update/${editingId}`, formData);
        } else {
            // CREATE: POST request to /create
            await axios.post(`${API_BASE_URL}/create`, formData);
        }
        // Reset form upon successful submission
        resetForm();
    } catch (error) {
        console.error('API submission error:', error.response?.data || error.message);
        setError('Error submitting data. Check server logs.');
    }

    // Re-fetch data to update the list from the backend
    await fetchEnquiries();
    setLoading(false);
  };

  // Handle clicking the "Edit" button
  const handleEdit = (enquiry) => {
    setFormData({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      message: enquiry.message,
    });
    setEditingId(enquiry._id); 
    // Clear any previous form validation errors when editing
    setEmailError(null);
    setPhoneError(null);
  };

  // Handle clicking the "Delete" button
  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
        await axios.delete(`${API_BASE_URL}/remove/${id}`);
    } catch (error) {
        console.error('API deletion error:', error.response?.data || error.message);
        setError('Error deleting data. Check server logs.');
    }
    
    await fetchEnquiries();
    setLoading(false);
  };

  // --- JSX Rendering ---
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 font-sans">
      <header>
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          User Enquiry Management
        </h1>
      </header>
      
      {/* Display General Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
        </div>
      )}

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Enquiry Form --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{editingId ? 'Edit Enquiry' : 'New Enquiry'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <FormInput
              label="Your Name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Your Name"
            />
            {/* Email Input (with validation) */}
            <FormInput
              label="Your Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Your Email"
              error={emailError} // PASS specific error prop
            />
            {/* Phone Input (with validation) */}
            <FormInput
              label="Your Phone"
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter Your Phone (digits only)"
              error={phoneError} // PASS specific error prop
            />
            {/* Message Textarea */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Leave a Message..."
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading} 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {editingId ? 'Update' : 'Save'}
            </button>
            {editingId && (
                <button
                    type="button"
                    onClick={resetForm} 
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-600 transition duration-300 shadow-md mt-2"
                >
                    Cancel Edit
                </button>
            )}
          </form>
        </div>

        {/* --- Right Column: Enquiry List --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Enquiry List</h2>
          
          {/* Loading States */}
          {loading && enquiries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                <svg className="animate-spin mx-auto h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className='mt-2'>Loading enquiries...</p>
             </div>
          )}

          {!loading && enquiries.length === 0 && !error && (
            <p className="text-center py-8 text-gray-500">No enquiries found in the database. Add one!</p>
          )}

          {/* Enquiry Table */}
          {enquiries.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 text-xs font-medium text-left text-gray-500 uppercase tracking-wider">SR NO</th>
                    <th className="p-3 text-xs font-medium text-left text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="p-3 text-xs font-medium text-left text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="p-3 text-xs font-medium text-left text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="p-3 text-xs font-medium text-left text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="p-3 text-xs font-medium text-left text-gray-500 uppercase tracking-wider">Delete</th>
                    <th className="p-3 text-xs font-medium text-left text-gray-500 uppercase tracking-wider">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {enquiries.map((enquiry, index) => (
                    <tr key={enquiry._id} className="hover:bg-gray-50"> 
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{index + 1}</td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{enquiry.name}</td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{enquiry.email}</td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{enquiry.phone}</td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{enquiry.message}</td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(enquiry._id)} 
                          disabled={loading}
                          className="bg-red-500 text-white py-1 px-3 rounded-md text-sm font-medium hover:bg-red-600 transition duration-300 disabled:bg-gray-400"
                        >
                          Delete
                        </button>
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(enquiry)}
                          disabled={loading}
                          className="bg-blue-500 text-white py-1 px-3 rounded-md text-sm font-medium hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
