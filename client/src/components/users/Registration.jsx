import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('Active'); // Default status
    const [role, setRole] = useState('User'); // Default role
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/register', { name, email, password, status, role });
            toast.success('User registered successfully'); // Success toast
            clearForm();
            navigate('/Users');
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errorMessage); // Error toast
        }
    };

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setStatus('Active');
        setRole('User');
    };

    return (
        <div className="flex items-center justify-center p-6 bg-gray-900 min-h-screen" style={{ filter: 'none', position: 'relative', zIndex: 10 }}>
            <section className="bg-gray-800 rounded-md shadow-lg p-8 w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Create User</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <label className="text-base font-medium text-gray-300">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="block w-full py-2 px-4 mt-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="text-base font-medium text-gray-300">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email to get started"
                            className="block w-full py-2 px-4 mt-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="text-base font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="block w-full py-2 px-4 mt-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="text-base font-medium text-gray-300">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="block w-full py-2 px-4 mt-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:border-blue-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="text-base font-medium text-gray-300">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="block w-full py-2 px-4 mt-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:border-blue-500"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Moderator">Moderator</option>
                        </select>
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                        <button
                            type="submit"
                            className="w-full py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Create User
                        </button>
                    </div>
                </form>
                <ToastContainer /> {/* Add ToastContainer here */}
            </section>
        </div>
    );
}
