import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import fireDB, { auth } from '../../firebaseConfig';
import uniqid from "uniqid";
import { useNavigate } from 'react-router-dom';

export default function CreateTeam() {

 const [teamName, setTeamName] = useState<string>("");

 const handleChange = (e: any): void => setTeamName(e.target.value);

 const navigate = useNavigate();

 const createTeam = async (): Promise<any> => {
  if (teamName === '') return;
  try {
   const teamId = uniqid();
   const docRef = doc(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamId}`);
   const teamInfo = {
     id: teamId,
     name: teamName
   };
   await setDoc(docRef, teamInfo);
   alert("Team created");
   navigate(`/team/${teamInfo.id}/manage`);
  } catch (err) {
   alert(`Team creation error: ${err}`);
  }
 }

 return (
  <div>
   <label>Name your team:</label>
   <input type="text" placeholder="Team name" value={teamName} onChange={handleChange}/>
   <button onClick={createTeam}>Create team</button>
  </div>
 );
}