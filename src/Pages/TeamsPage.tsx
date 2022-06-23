import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import fireDB, { auth } from '../firebaseConfig';
import "../Styles/Teams.css";
import { getAuth } from 'firebase/auth';

export default function TeamsPage() {

 const [noTeams, setNoTeams] = useState<boolean>(false);
 const [teams, setTeams] = useState<any[]>([]);

 useEffect(() => {
  const q = query(collection(fireDB, "users", `${getAuth().currentUser?.uid}`, "teams"));
  const unsub = onSnapshot(q, snapshot => {
   console.log(1);
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
  <div className='teams-page-container'>
   {noTeams && <h1 className='no-teams'>You haven't added any teams, yet.</h1>}
   {!noTeams && teams.length > 0 && 
    <div className="teams-container">
     <h3 className='teams-header'>Here are your teams:</h3>
     <ul>
      {teams.length > 0 && teams.map((team: any) => {
       return (
        <li className='team-link-element' key={team.id}>
         <Link to={`/team/${team.id}/manage`} className='team-link'>{team.name}</Link>
        </li>
       );
      })}
     </ul>
    </div>
   }
  </div>
 );
}