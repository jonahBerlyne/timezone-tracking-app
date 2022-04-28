import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa"
import fireDB from '../../../firebaseConfig';
import { doc, setDoc, getDocs, query, collection, deleteDoc } from "firebase/firestore";

interface EditTeamInfoInterface {
 displayMembersDiv: () => void;
 teamId: string | undefined;
};

export default function EditTeamInfo({ displayMembersDiv, teamId }: EditTeamInfoInterface) {

 const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

 const teams = JSON.parse(localStorage.getItem("teams") || "{}");
 const [teamNameInput, setTeamNameInput] = useState<string>("");
 const [teamName, setTeamName] = useState<string>("");
 
 const team: any = teams.filter((team: any) => team.id === teamId);
 
 useEffect(() => {
  setTeamNameInput(team[0].name);
  setTeamName(team[0].name);
 }, []);

 const handleChange = (e: any): void => setTeamNameInput(e.target.value);

 const saveNameChange = async (): Promise<any> => {
  try {
   const docRef = doc(fireDB, "users", `${user.uid}`, "teams", `${teamId}`);
   const teamInfo = {
    id: teamId,
    name: teamNameInput
   };
   await setDoc(docRef, teamInfo);
   const teamsCollection = query(collection(fireDB, "users", `${user.uid}`, "teams"));
   const teamsSnapshot = await getDocs(teamsCollection);
   let teamsArr: any[] = [];
   teamsSnapshot.forEach(team => {
    teamsArr.push(team.data());
   });
   localStorage.setItem("teams", JSON.stringify(teamsArr));
   alert("Team name saved");
   window.location.href = `/team/${teamId}/manage`;
  } catch (err) {
   alert(`Name change error: ${err}`);
  }
 }

 const deleteTeam = async (): Promise<any> => {
  try {
   const membersCollection = query(collection(fireDB, "users", `${user.uid}`, "teams", `${teamId}`, "team_members"));
   const membersSnapshot = await getDocs(membersCollection);
   membersSnapshot.forEach(async member => {
    const memberRef = doc(fireDB, "users", `${user.uid}`, "teams", `${teamId}`, "team_members", `${member.data().id}`);
    await deleteDoc(memberRef);
   });
   const docRef = doc(fireDB, "users", `${user.uid}`, "teams", `${teamId}`);
   await deleteDoc(docRef);
   const newTeams: any = teams.filter((team: any) => team.id !== teamId);
   localStorage.setItem("teams", JSON.stringify(newTeams));
   alert("Team deleted");
   window.location.href = `/teams`;
  } catch (err) {
   alert(`Team deletion error: ${err}`);
  }
 }

 return (
  <div style={{display: "flex", flexDirection: "column"}}>

   <button onClick={displayMembersDiv}>
    <span>
     <FaArrowLeft size={25}/>
    </span>
   </button>

   <label>Change team name:</label>
   <input value={teamNameInput} onChange={handleChange}/>

   <button onClick={saveNameChange}>Save</button>

   <label>Delete your team:</label>
   <button onClick={deleteTeam}>Delete {teamName}</button>
  </div>
 );
}