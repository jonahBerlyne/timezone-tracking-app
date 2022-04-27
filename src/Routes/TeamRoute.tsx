import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import TeamNavbar from '../User/Team/TeamNavbar';

export default function TeamRoute ({children}: {children: any}) {
 const [pending, setPending] = useState<boolean>(true);
 const [currentUser, setCurrentUser] = useState<User | null>(null);
 const auth = getAuth();

 const teams = JSON.parse(localStorage.getItem("teams") || "{}");
 const teamId = useParams();
 const [teamName] = teams.filter((team: any) => team.id === teamId.id);

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


 if (currentUser && teams.length > 0 && teams.includes(teamName)) {
  return (
   <div>
    <TeamNavbar/>
    {children}
    {/* <Footer/> */}
   </div>
  );
 } else {
  return <Navigate to="/"/>;
 }
}