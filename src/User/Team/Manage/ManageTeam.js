import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import TeamMembers from './TeamMembers';
import AddTeamMember from './AddTeamMember';
import EditTeamInfo from './EditTeamInfo';

export default function ManageTeam() {

 const team = useParams();

 const [showMembers, setShowMembers] = useState(true);
 const [showAddMember, setShowAddMember] = useState(false);
 const [showEditTeam, setShowEditTeam] = useState(false);

 const displayMembersDiv = () => {
  setShowAddMember(false);
  setShowEditTeam(false);
  setShowMembers(true);
 }

 const displayAddMemberDiv = () => {
  setShowMembers(false);
  setShowEditTeam(false);
  setShowAddMember(true);
 }

 const displayEditTeamDiv = () => {
  setShowMembers(false);
  setShowAddMember(false);
  setShowEditTeam(true);
 }

 const goBackToTeamPage = () => window.location = `/team/${team.id}`;

 return (
  <div style={{display: "flex", gap: "100px"}}>

   <div style={{display: "flex", flexDirection: "column"}}>
    <p>Edit and add members of your team here.</p>
    <button onClick={displayAddMemberDiv}>Add team member</button>
    <button onClick={displayEditTeamDiv}>Edit team info</button>
    <button style={{textDecoration: "none", color: "#000"}} onClick={goBackToTeamPage}>Go back to my team</button>
   </div>

   {showMembers && <TeamMembers teamId={team.id}/>}

   {showAddMember && <AddTeamMember displayMembersDiv={displayMembersDiv} teamId={team.id}/>}

   {showEditTeam && <EditTeamInfo displayMembersDiv={displayMembersDiv} teamId={team.id}/>}

  </div>
 );
}