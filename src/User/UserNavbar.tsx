import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { logout } from "../App";
import { auth } from '../firebaseConfig';
import { useAppSelector } from '../Redux/hooks';
import { selectUser } from '../Redux/userSlice';

export default function UserNavbar() {

 const user = useAppSelector(selectUser);

 return (
    <div className='header'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            {user?.name && <h1 className="navbar-brand">Welcome, {user.name}!</h1>}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span>
                <FaBars size={25} color="gray"/>
              </span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/profile/${auth.currentUser?.uid}`}>Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/account">Account Settings</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">Teams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create_team">Add New Team</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={() => logout()}>Log Out</Link>
                </li>
              </ul>
            </div>
          </div>
    </nav>
   </div>
  );
}