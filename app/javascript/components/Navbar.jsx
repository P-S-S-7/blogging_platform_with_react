import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const Navbar = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const isSignedIn = localStorage.getItem('isSignedIn');
        const userEmail = localStorage.getItem('userEmail');

        if (isSignedIn === 'true') {
            setCurrentUser({ email: userEmail });
        } else {
            setCurrentUser(null);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isSignedIn');
        localStorage.removeItem('userEmail');
        setCurrentUser(null);
        history.push('/'); 
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container-fluid">
                <Link to="/" className="btn btn-primary ms-2 rounded-pill">Home</Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {currentUser ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link text-white">{currentUser.email}</span>
                                </li>
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="btn btn-danger ms-2 rounded-pill">
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/users/sign_in" className="btn btn-primary ms-2 rounded-pill">Sign In</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/users/sign_up" className="btn btn-primary ms-2 rounded-pill">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;