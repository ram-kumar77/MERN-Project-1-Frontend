import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreateEventPage from '../User/CreateEventPage'; // Updated import to CreateEventPage

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md ">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/home" className="text-2xl font-bold"> Eventine </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="mr-4"> Welcome, <span className='font-bold ' > {user ? user.name : 'User'}</span></span>
                    <Link to="/dashboard" className="hover:text-blue-200"> Dashboard </Link>
                    <Link to="/create-event" className="hover:text-blue-200"> Create Event </Link> {/* Updated link */}
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"> Logout </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
