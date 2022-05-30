import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import TeamMembers from './TeamMembers';
import AddTeamMember from './AddTeamMember';
import EditTeamInfo from './EditTeamInfo';
import "../../../Styles/Manage.css";
import { collection, onSnapshot, query } from 'firebase/firestore';
import fireDB, { auth } from '../../../firebaseConfig';

export default function ManageTeam() {

 const teamParam = useParams();

 const [teamName, setTeamName] = useState<string>("");
 
 useEffect(() => {
  const q = query(collection(fireDB, "users", `${auth.currentUser?.uid}`, "teams"));
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

 const [showMembers, setShowMembers] = useState<boolean>(true);
 const [showAddMember, setShowAddMember] = useState<boolean>(false);
 const [showEditTeam, setShowEditTeam] = useState<boolean>(false);

 const displayMembersDiv = (): void => {
  setShowAddMember(false);
  setShowEditTeam(false);
  setShowMembers(true);
 }

 const displayAddMemberDiv = (): void => {
  setShowMembers(false);
  setShowEditTeam(false);
  setShowAddMember(true);
 }

 const displayEditTeamDiv = (): void => {
  setShowMembers(false);
  setShowAddMember(false);
  setShowEditTeam(true);
 }

 const navigate = useNavigate();

 return (
  <div className='manage-page-container'>

  {!showAddMember && !showEditTeam && teamName !== '' && 
   <div className='manage-sidebar-container'>
    <h1 className='manage-team-header'>Getting started with {teamName}</h1>
    <div className="manage-team-text-container">
     <p>Here you can manage your team.</p>
     <p>When you're done, you can click the button below or the X at the top right. To get back here you can always click the "Manage Team" button at the left on your team dashboard.</p>
    </div>
    <div className="manage-team-btns-container">
     <button className='btn btn-primary go-to-add-member-btn' onClick={displayAddMemberDiv}>Add a team member</button>
     <button className='btn go-to-edit-team-btn' onClick={displayEditTeamDiv}>Edit team info</button>
     <button className='btn go-to-team-page-btn' onClick={() => navigate(`/team/${teamParam.id}`)}>Show me my team!</button>
    </div>
   </div>
  }

   {showMembers && <TeamMembers teamId={teamParam.id}/>}

   {showAddMember && <AddTeamMember displayMembersDiv={displayMembersDiv} teamId={teamParam.id}/>}

   {showEditTeam && <EditTeamInfo displayMembersDiv={displayMembersDiv} teamId={teamParam.id}/>}

  </div>
 );
}