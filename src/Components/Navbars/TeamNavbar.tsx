import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import fireDB, { auth } from '../../firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useAppDispatch } from '../../Redux/hooks';
import { logout } from '../../Redux/userSlice';
import { signOut } from 'firebase/auth';
import "../../Styles/Team.css";

export default function TeamNavbar() {

 const dispatch = useAppDispatch();

 const logOut = async (): Promise<any> => {
   try {
     dispatch(logout());
     await signOut(auth);
   } catch (err) {
     alert(`Sign out error: ${err}`);
   }
 }

 const teamParam = useParams();
 const [teamName, setTeamName] = useState<string>("");
 
 useEffect(() => {
  const q = query(collection(fireDB, "users", `${auth.currentUser?.uid}`, "teams"));
  const unsub = onSnapshot(q, snapshot => {
   snapshot.docs.forEach(doc => {
    if (doc.data()?.id === teamParam.id) {
     setTeamName(doc.data()?.name);
     return;
    }
   });
  });
  return unsub;
 }, []);

 const navigate = useNavigate();

 return (
    <div className='header team-navbar-header'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <IconButton onClick={() => navigate(`/team/${teamParam.id}/manage`)}>
             <Settings color="primary" />
            </IconButton>
            {teamName !== "" && <h1 className="navbar-brand team-navbar-name">{teamName}</h1>}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span>
                <FaBars size={25} color="gray"/>
              </span>
            </button>
            <div className="collapse navbar-collapse team-navbar-menu" id="navbarNav">
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