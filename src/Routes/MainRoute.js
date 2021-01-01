import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import UserNavbar from '../User/UserNavbar';
import AuthNavbar from '../Auth/AuthNavbar';

export default function MainRoute ({children}) {
 const [pending, setPending] = useState(true);
 const [currentUser, setCurrentUser] = useState(null);
 const auth = getAuth();

 useEffect(() => {
  const unsub = onAuthStateChanged(
   auth,
   user => {
    user ? setCurrentUser(user) : setCurrentUser(null);
    setPending(false);
   },
   err => {
    alert(`Error: ${err}`);
    setPending(false);
   }
  );

  return unsub;
 }, []);

 if (pending) return null;
 return (
  <div>
   {currentUser ? <UserNavbar/> : <AuthNavbar/>}
   {children}
   {/* <Footer/> */}
  </div>
 );
}