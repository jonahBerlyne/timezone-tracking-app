import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import fireDB, { auth } from '../../firebaseConfig';

export default function TeamsPage() {

 const [noTeams, setNoTeams] = useState<boolean>(false);
 const [teams, setTeams] = useState<any[]>([]);

 useEffect(() => {
  const q = query(collection(fireDB, "users", `${auth.currentUser?.uid}`, "teams"));
  const unsub = onSnapshot(q, snapshot => {
   let teamsArr: any[] = [];
   snapshot.docs.forEach(doc => {
    const teamDoc = {
     ...doc.data()
    };
    teamsArr.push(teamDoc);
   });
   teamsArr.length > 0 ? setTeams(teamsArr) : setNoTeams(true);
  });
  return unsub;
 }, []);
 
 return (
  <div>
   {noTeams && <h1>You haven't added any teams, yet.</h1>}
   {teams.length > 0 && <h1>Here are your teams:</h1>}
   {teams.length > 0 && teams.map((team: any) => {
    return (
     <div key={team.id}>
      <Link to={`/team/${team.id}`}>{team.name}</Link>
     </div>
    );
   })}
  </div>
 );
}