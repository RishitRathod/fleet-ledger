import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // Default role is 'user'
        groupName: '' // Group name for admins
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, role, groupName } = signupInfo;

        // Validation
        if (!name || !email || !password || !role || (role === 'admin' && !groupName)) {
            return handleError('All fields are required. Please fill in all the details.');
        }

        // Determine API endpoint based on role
        const url =
            role === 'admin'
                ? `http://localhost:5000/auth/adminSignup`
                : `http://localhost:5000/auth/userSignup`;

        console.log('Sending signup request to:', url, signupInfo); // Debug log

        try {
            // Send API request
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });

            const result = await response.json();
            console.log('Server Response:', result); // Debug log

            const { success, message, error } = result;

            if (success) {
                // Display success message and navigate to login
                handleSuccess(message);
                setTimeout(() => navigate('/login'), 1000);
            } else {
                // Handle validation or server errors
                handleError(error?.details?.[0]?.message || message || 'Signup failed');
            }
        } catch (err) {
            // Handle network or unexpected errors
            console.error('Fetch Error:', err);
            handleError(err.message || 'Something went wrong during signup.');
        }
    };

    return (
        <div className='container'>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        autoFocus
                        placeholder='Enter your name...'
                        value={signupInfo.name}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={signupInfo.email}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={signupInfo.password}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='role'>Role</label>
                    <select name='role' value={signupInfo.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Show group name input only for admins */}
                {signupInfo.role === 'admin' && (
                    <div>
                        <label htmlFor='groupName'>Group Name</label>
                        <input
                            onChange={handleChange}
                            type='text'
                            name='groupName'
                            placeholder='Enter your group name...'
                            value={signupInfo.groupName}
                            required
                        />
                    </div>
                )}

                <button type='submit'>Signup</button>
                <span>Already have an account? <Link to="/login">Login</Link></span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Signup;
