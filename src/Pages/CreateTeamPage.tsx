import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import fireDB from '../firebaseConfig';
import uniqid from "uniqid";
import { useNavigate } from 'react-router-dom';
import "../Styles/Teams.css";
import { getAuth } from 'firebase/auth';

export default function CreateTeamPage() {

 const [teamName, setTeamName] = useState<string>("");

 const navigate = useNavigate();

 const createTeam = async (): Promise<any> => {
  if (teamName === '') return;
  try {
   const teamId = uniqid();
   const docRef = doc(fireDB, "users", `${getAuth().currentUser?.uid}`, "teams", `${teamId}`);
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
  <div className='create-team-container'>
   <h4>Add a team!</h4>
   <input data-testid="teamName" type="text" placeholder="Team name" value={teamName} onChange={(e) => setTeamName(e.target.value)} maxLength={25} />
   <button data-testid="createTeamBtn" className='btn btn-primary' onClick={createTeam}>Create team</button>
  </div>
 );
}