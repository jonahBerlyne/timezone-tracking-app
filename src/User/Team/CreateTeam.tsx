import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import fireDB from '../../firebaseConfig';
import uniqid from "uniqid";

export default function CreateTeam() {

 const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

 const [teamName, setTeamName] = useState<string>("");

 const handleChange = (e: any): void => setTeamName(e.target.value);

 const createTeam = async (): Promise<any> => {
  if (teamName === '') return;
  try {
   const teamId = uniqid();
   const docRef = doc(fireDB, "users", `${user.uid}`, "teams", `${teamId}`);
   const teamInfo = {
     id: teamId,
     name: teamName
   };
   await setDoc(docRef, teamInfo);
   const teams = JSON.parse(localStorage.getItem("teams") || "{}");
   localStorage.setItem("teams", JSON.stringify([...teams, teamInfo]));
   alert("Team created");
   window.location.href = `/team/${teamInfo.id}/manage`;
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