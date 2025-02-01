import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from 'E:/fleet-ledger/fleet-ledger/fleet_ledger_frontend/src/utils.js';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
    
        if (!email || !password) {
            return handleError('Email and password are required');
        }
    
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo)
            });
    
            const result = await response.json();
            console.log("Server Response:", result); // Print response to console
    
            const { success, message, jwtToken, name, role, error } = result;
    
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('role', role);
    
                setTimeout(() => {
                    if (role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/admin/dashboard'); // Change this if users have a different dashboard
                    }
                }, 1000);
            } else if (error) {
                handleError(error?.details[0]?.message || 'An error occurred');
            } else {
                handleError(message);
            }
        } catch (err) {
            console.error("Fetch Error:", err); // Print error to console
            handleError(err.message || 'Something went wrong');
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
