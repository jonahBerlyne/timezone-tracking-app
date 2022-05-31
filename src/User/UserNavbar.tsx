import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { auth } from '../firebaseConfig';
import { WatchLater } from "@mui/icons-material";
import { useAppDispatch } from '../Redux/hooks';
import { logout } from '../Redux/userSlice';
import { signOut } from 'firebase/auth';

export default function UserNavbar() { 

 const dispatch = useAppDispatch();

 const logOut = async (): Promise<any> => {
   try {
     dispatch(logout());
     await signOut(auth);
   } catch (err) {
     alert(`Sign out error: ${err}`);
   }
 }

 return (
    <div className='header' style={{ fontFamily: "Lato, sans-serif" }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <WatchLater color="primary" />
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span>
                <FaBars size={25} color="gray"/>
              </span>
            </button>
            <div className="collapse navbar-collapse" style={{ textAlign: "center", marginRight: "25px" }} id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/profile/${auth.currentUser?.uid}`}>Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">Teams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create_team">Add New Team</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={() => logOut()}>Log Out</Link>
                </li>
              </ul>
            </div>
          </div>
    </nav>
   </div>
  );
}