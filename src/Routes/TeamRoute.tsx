import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import fireDB, { auth } from '../firebaseConfig';
import TeamNavbar from '../User/Team/TeamNavbar';
import { collection, getDocs, query } from 'firebase/firestore';

export default function TeamRoute ({children}: {children: any}) {
 const [pending, setPending] = useState<boolean>(true);
 const [currentUser, setCurrentUser] = useState<User | null>(null);

 const [teams, setTeams] = useState<any[]>([]);
 const teamId = useParams();
 const [team, setTeam] = useState<any>([]);

 const getTeamInfo = async (user: any): Promise<any> => {
  try {
   const q = query(collection(fireDB, "users", `${user.uid}`, "teams"));
   const querySnapshot = await getDocs(q);
   let teamsArr: any[] = [];
   querySnapshot.forEach(doc => {
    teamsArr.push(doc.data());
   });
   if (teamsArr.length === 0) {
    return;
   } else {
    setTeams(teamsArr);
   }
  } catch (err) {
   alert(`Team retrieval error: ${err}`);
  }
 }

 useEffect(() => {
  const unsub = onAuthStateChanged(
   auth,
   user => {
    if (user) {
     getTeamInfo(user);
     setCurrentUser(user);
    } else {
     setCurrentUser(null);
    }
    setPending(false);
   },
   err => {
    alert(`Error: ${err}`);
    setPending(false);
   }
  );

  return unsub;
 }, []);

 useEffect(() => {
  if (teams.length > 0) {
   const _team = teams.filter(t => t.id === teamId);
   if (_team) setTeam(_team);
  }
 }, [teams]);

 if (pending) return null;

 if (currentUser && teams.length > 0 && teams.includes(team)) {
  return (
   <div>
    <TeamNavbar />
    {children}
   </div>
  );
 } else {
  return <Navigate to="/"/>;
 }
}