import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

export default function AppRoute ({children}) {
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

 if (currentUser) {
  return (
    <div>
      {children}
    </div>
  );
 } else {
   return <Navigate to="/login" />;
 }
}