import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;

        // Input validation
        if (!email || !password) {
            return handleError('Email and password are required');
        }

        try {
            // Log input for debugging
            console.log("Login Request:", loginInfo);

            // Send POST request to the login endpoint
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo)
            });

            // Parse the response
            const result = await response.json();
            console.log("Server Response:", result); // Debugging log

            const { success, message, jwtToken, name, role, error } = result;

            if (success) {
                // Handle successful login
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('role', role);

                // Redirect based on role
                setTimeout(() => {
                    if (role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/user/dashboard'); // Adjust this for user dashboard
                    }
                }, 1000);
            } else if (error) {
                // Handle errors with error details
                console.warn("Server Error:", error);
                handleError(error?.details?.[0]?.message || 'An unexpected error occurred');
            } else {
                // Handle general failure message
                console.warn("Login Failed:", message);
                handleError(message);
            }
        } catch (err) {
            // Catch network or unexpected errors
            console.error("Fetch Error:", err); // Debugging log
            handleError(err.message || 'Something went wrong while connecting to the server');
        }
    };

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
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
                        value={loginInfo.password}
                        required
                    />
                </div>
                <button type='submit'>Login</button>
                <span>Don't have an account? <Link to="/signup">Signup</Link></span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;
