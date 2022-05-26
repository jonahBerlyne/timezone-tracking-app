import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa"
import fireDB, { auth } from '../../../firebaseConfig';
import { doc, setDoc, getDocs, query, collection, deleteDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

interface EditTeamInfoInterface {
 displayMembersDiv: () => void;
 teamId: string | undefined;
};

export default function EditTeamInfo({ displayMembersDiv, teamId }: EditTeamInfoInterface) {

 const [teamNameInput, setTeamNameInput] = useState<string>("");
 const [teamName, setTeamName] = useState<string>("");
 
 useEffect(() => {
  const q = query(collection(fireDB, "users", `${auth.currentUser?.uid}`, "teams"));
  const unsub = onSnapshot(q, snapshot => {
   snapshot.docs.forEach(doc => {
    if (doc.data()?.id === teamId) {
     setTeamNameInput(doc.data()?.name);
     setTeamName(doc.data()?.name);
     return;
    }
   });
  });
  return unsub;
 }, []);

 const navigate = useNavigate();

 const handleChange = (e: any): void => setTeamNameInput(e.target.value);

 const saveNameChange = async (): Promise<any> => {
  try {
   const docRef = doc(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamId}`);
   const teamInfo = {
    id: teamId,
    name: teamNameInput
   };
   await setDoc(docRef, teamInfo);
   alert("Team name saved");
   navigate(`/team/${teamId}/manage`);
  } catch (err) {
   alert(`Name change error: ${err}`);
  }
 }

 const deleteTeam = async (): Promise<any> => {
  try {
   const membersCollection = query(collection(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamId}`, "team_members"));
   const membersSnapshot = await getDocs(membersCollection);
   membersSnapshot.forEach(async member => {
    const memberRef = doc(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamId}`, "team_members", `${member.data().id}`);
    await deleteDoc(memberRef);
   });
   const docRef = doc(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamId}`);
   await deleteDoc(docRef);
   alert("Team deleted");
   navigate(`/teams`);
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