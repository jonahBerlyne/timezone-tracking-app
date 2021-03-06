import React, { useState, useEffect } from 'react';
import fireDB, { auth } from '../firebaseConfig';
import { doc, setDoc, getDocs, query, collection, deleteDoc, onSnapshot } from "firebase/firestore";
import { useNavigate, useParams } from 'react-router-dom';
import "../Styles/Manage.css";
import { getAuth } from 'firebase/auth';

export default function EditTeamInfoPage() {

 const teamParam = useParams();

 const [teamNameInput, setTeamNameInput] = useState<string>("");
 const [teamName, setTeamName] = useState<string>("");
 
 useEffect(() => {
  const q = query(collection(fireDB, "users", `${getAuth().currentUser?.uid}`, "teams"));
  const unsub = onSnapshot(q, snapshot => {
   snapshot.docs.forEach(doc => {
    if (doc.data()?.id === teamParam.id) {
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
   const docRef = doc(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamParam.id}`);
   const teamInfo = {
    id: teamParam.id,
    name: teamNameInput
   };
   await setDoc(docRef, teamInfo);
   alert("Team name saved");
  } catch (err) {
   alert(`Name change error: ${err}`);
  }
 }

 const deleteTeam = async (): Promise<any> => {
  try {
   const membersCollection = query(collection(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamParam.id}`, "team_members"));
   const membersSnapshot = await getDocs(membersCollection);
   membersSnapshot.forEach(async member => {
    const memberRef = doc(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamParam.id}`, "team_members", `${member.data().id}`);
    await deleteDoc(memberRef);
   });
   const docRef = doc(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamParam.id}`);
   await deleteDoc(docRef);
   alert("Team deleted");
   navigate(`/teams`);
  } catch (err) {
   alert(`Team deletion error: ${err}`);
  }
 }

 return (
  <div className='edit-team-info-container'>

   {teamName !== '' &&
    <>
     <div className="edit-team-name-container">
      <p>Change team name</p>
      <input value={teamNameInput} onChange={handleChange} maxLength={25} />
      <button className="btn change-team-name-btn" onClick={saveNameChange}>Save</button>
     </div>

     <div className="delete-team-container">
      <p>Delete your team, this cannot be undone</p>
      <button className='btn btn-danger delete-team-btn' onClick={deleteTeam}>Delete {teamName}</button>
     </div>

     <button className='btn btn-primary' onClick={() => navigate(`/team/${teamParam.id}/manage`)}>Go Back</button>
    </> 
   }

  </div>
 );
}