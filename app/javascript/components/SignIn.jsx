import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';

const SignIn = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (location.state && location.state.message) {
            setErrors([location.state.message.text]);
        }
    }, [location]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let validationErrors = [];

        if (!validateEmail(email)) {
            validationErrors.push("Invalid email format");
        }

        if (password.length < 6) {
            validationErrors.push("Password must be at least 6 characters long");
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios
            .post(
                '/users/sign_in',
                { user: { email, password } },
                { withCredentials: true }
            )
            .then((response) => {
                console.log('Signin successful', response);
                localStorage.setItem('isSignedIn', 'true');
                localStorage.setItem('userEmail', email);
                window.location.href = '/';
            })
            .catch((error) => {
                if (error.response) {
                    setErrors(['Invalid email or password']);
                } else if (error.request) {
                    setErrors(['No response from server']);
                } else {
                    setErrors([error.message]);
                }
                console.error(error);
            });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Sign In</h2>

                {errors.length > 0 && (
                    <div className="alert alert-danger">
                        <ul className="mb-0">
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;