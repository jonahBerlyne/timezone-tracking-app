import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import AuthNavbar from '../Auth/AuthNavbar';

export default function AuthRoute ({children}: {children: any}) {
 const [pending, setPending] = useState<boolean>(true);
 const [currentUser, setCurrentUser] = useState<User | null>(null);
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

 if (!currentUser) {
   return (
    <div>
     <AuthNavbar/>
     {children}
     {/* <Footer/> */}
    </div>
   );
 } else {
   return <Navigate to="/"/>;
 }
}