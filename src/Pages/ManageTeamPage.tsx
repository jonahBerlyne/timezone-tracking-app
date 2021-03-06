import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import TeamMembers from '../Components/Team/TeamMembers';
import "../Styles/Manage.css";
import { collection, onSnapshot, query } from 'firebase/firestore';
import fireDB from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

export default function ManageTeamPage() {

 const teamParam = useParams();

 const [teamName, setTeamName] = useState<string>("");
 
 useEffect(() => {
  const q = query(collection(fireDB, "users", `${getAuth().currentUser?.uid}`, "teams"));
  const unsub = onSnapshot(q, snapshot => {
   snapshot.docs.forEach(doc => {
    if (doc.data()?.id === teamParam.id) {
     setTeamName(doc.data()?.name);
     return;
    }
   });
  });
  return unsub;
 }, []);

 const navigate = useNavigate();

 return (
  <div className='manage-page-container'>

   {teamName !== '' && 
    <div className='manage-team-container'>

     <div className="manage-team-info-container">

      <div className="manage-team-text-container">
       <h1 className='manage-team-header'>Getting started with {teamName}</h1>
       <p>Here you can manage your team.</p>
       <p>You can add new team members, delete team members, and change your team name (and if you want to, you can delete your team entirely). To get back here, you can always click the "Manage Team" gear icon at the left on your team dashboard.</p>
      </div>

      <div className="manage-team-members-container">
       <TeamMembers teamId={teamParam.id} />
      </div>
      
     </div>


     <div className="manage-team-btns-container">
      <button className='btn btn-primary go-to-add-member-btn' onClick={() => navigate(`/team/${teamParam.id}/manage/add`)}>Add a team member</button>
      <button className='btn go-to-edit-team-btn' onClick={() => navigate(`/team/${teamParam.id}/manage/edit`)}>Edit team info</button>
      <button className='btn go-to-team-page-btn' onClick={() => navigate(`/team/${teamParam.id}`)}>Show me my team!</button>
     </div>
    </div>
   }

  </div>
 );
}