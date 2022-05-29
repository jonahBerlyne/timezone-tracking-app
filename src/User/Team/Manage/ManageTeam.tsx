import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import TeamMembers from './TeamMembers';
import AddTeamMember from './AddTeamMember';
import EditTeamInfo from './EditTeamInfo';
import "../../../Styles/Manage.css";

export default function ManageTeam() {

 const teamParam = useParams();

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

   <div className='manage-sidebar-container'>
    <h1 className='manage-team-header'>Getting started with</h1>
    <div className="manage-team-text-container">
     <p>Here you can manage your team.</p>
     <p>When you're done, you can click the button below or the X at the top right. To get back here you can always click the "Manage Team" button at the left on your team dashboard.</p>
    </div>
    <div className="manage-team-btns-container">
     <button className='btn btn-primary go-to-add-member-btn' onClick={displayAddMemberDiv}>Add team member</button>
     <button className='btn btn-secondary go-to-edit-team-btn' onClick={displayEditTeamDiv}>Edit team info</button>
     <button className='btn btn-secondary go-to-team-page-btn' onClick={() => navigate(`/team/${teamParam.id}`)}>Show me my team!</button>
    </div>
   </div>

   {showMembers && <TeamMembers teamId={teamParam.id}/>}

   {showAddMember && <AddTeamMember displayMembersDiv={displayMembersDiv} teamId={teamParam.id}/>}

   {showEditTeam && <EditTeamInfo displayMembersDiv={displayMembersDiv} teamId={teamParam.id}/>}

  </div>
 );
}