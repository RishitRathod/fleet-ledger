import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',  // Default role is 'user'
        groupName: ''  // New field for group name
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo({ ...signupInfo, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, role, groupName } = signupInfo;

        if (!name || !email || !password || !role || (role === 'admin' && !groupName)) {  // Only require groupName if role is 'admin'
            return handleError('All fields are required');
        }

        try {
            // Set URL based on role
            const url = role === 'admin' 
                ? `http://localhost:5000/auth/adminSignup` 
                : `http://localhost:5000/auth/userSignup`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });

            const result = await response.json();
            const { success, message, error } = result;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                handleError(error?.details?.[0]?.message || message);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
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
                    />
                </div>
                <div>
                    <label htmlFor='role'>Role</label>
                    <select name='role' value={signupInfo.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Conditionally render the groupName input only if the role is 'admin' */}
                {signupInfo.role === 'admin' && (
                    <div>
                        <label htmlFor='groupName'>Group Name</label>
                        <input
                            onChange={handleChange}
                            type='text'
                            name='groupName'
                            placeholder='Enter your group name...'
                            value={signupInfo.groupName}
                        />
                    </div>
                )}

                <button type='submit'>Signup</button>
                <span>Already have an account? 
                    <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Signup;
