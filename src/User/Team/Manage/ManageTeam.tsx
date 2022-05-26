import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import TeamMembers from './TeamMembers';
import AddTeamMember from './AddTeamMember';
import EditTeamInfo from './EditTeamInfo';

export default function ManageTeam() {

 const team = useParams();

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
  <div style={{display: "flex", gap: "100px"}}>

   <div style={{display: "flex", flexDirection: "column"}}>
    <p>Edit and add members of your team here.</p>
    <button onClick={displayAddMemberDiv}>Add team member</button>
    <button onClick={displayEditTeamDiv}>Edit team info</button>
    <button style={{textDecoration: "none", color: "#000"}} onClick={() => navigate(`/team/${team.id}`)}>Go back to my team</button>
   </div>

   {showMembers && <TeamMembers teamId={team.id}/>}

   {showAddMember && <AddTeamMember displayMembersDiv={displayMembersDiv} teamId={team.id}/>}

   {showEditTeam && <EditTeamInfo displayMembersDiv={displayMembersDiv} teamId={team.id}/>}

  </div>
 );
}