import React, { useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { FaBars, FaCog } from "react-icons/fa";
import { logout } from '../../App';

export default function TeamNavbar() {

 const user = JSON.parse(localStorage.getItem("currentUser"));

 const teams = JSON.parse(localStorage.getItem("teams"));
 const teamId = useParams();
 const [teamName] = teams.filter(team => team.id === teamId.id);

 return (
    <div className='header'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <h1 className="navbar-brand">{teamName.name}</h1>
            <Link to={`/team/${teamId.id}/manage`}>
             <span>
              <FaCog size={25}/>
             </span>
            </Link>
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
                  <Link className="nav-link" to={`/profile/${user.uid}`}>Profile</Link>
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